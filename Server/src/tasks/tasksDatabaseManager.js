const pg = require("pg");
const {configs} = require("../../configs");
const dotenv = require("dotenv");
dotenv.config();


const MAX_ID = 1000;
const TABLE_NAME_TASKS = "tasks";
const TABLE_NAME_TASKS_OCCURENCES = "tasks_occurences";

const pool = new pg.Pool({
    user: process.env.DATABASE_USERNAME,
    host: configs.databaseHost,
    database: configs.databaseName,
    password: process.env.DATABASE_PASSWORD,
    port: configs.databasePort,
});

exports.createTask =  async (taskLabel, score, importance) => {
    try {
        let { rows } = await pool.query("SELECT id FROM tasks;");
        let id = getUnusedIds(rows);
        let queryText = `INSERT INTO ${TABLE_NAME_TASKS} VALUES ($1,$2,$3,$4);`;
        let queryValues = [id, taskLabel, score, importance];
        await pool.query(queryText, queryValues);
        console.log(`createTask : Added row(${id},${taskLabel},${score},${importance}) to table ${TABLE_NAME_TASKS}`);
        return id;
    }
    catch(e) {
        console.log(e);
        console.log(`createTask : Error when tried to add ${taskLabel} , ${score}, ${importance}`);
    }
}

async function addWeekToTask(taskId, week){
    try {
        let queryText = `INSERT INTO ${TABLE_NAME_TASKS_OCCURENCES} VALUES ($1,$2,null);`;
        let queryValues = [taskId, week];
        await pool.query(queryText, queryValues);
        console.log(`addWeekToTask : Added row(${taskId},${week},null) to table ${TABLE_NAME_TASKS_OCCURENCES}`);
    }
    catch(e) {
        console.log(e);
        console.log(`addWeekToTask : Error when tried to add ${taskId} , ${week}`);
    }
}
exports.addWeekToTask = addWeekToTask;

exports.addWeeksToTask = async (taskId, weeks) => {
    await weeks.forEach(async week => {
        await addWeekToTask(taskId,week);
    });
}

async function addWeekAndDayToTask(taskId, week, day){
    try {
        let queryText = `INSERT INTO ${TABLE_NAME_TASKS_OCCURENCES} VALUES ($1,$2,$3);`;
        let queryValues = [taskId, week, day];
        await pool.query(queryText, queryValues);
        console.log(`addWeekAndDayToTask : Added row(${taskId},${week},${day}) to table ${TABLE_NAME_TASKS_OCCURENCES}`);
    }
    catch(e) {
        console.log(e);
        console.log(`addWeekAndDayToTask : Error when tried to add ${taskId} , ${week}, ${day}`);
    }
}
exports.addWeekAndDayToTask = addWeekAndDayToTask;

exports.addWeeksWithDayToTask = async (taskId, weeks, day) => {
    for (let i = 0; i < weeks.length; i++){
        await addWeekAndDayToTask(taskId,weeks[i],day);
    }
}

exports.updateDayOfWeekOfTask = async (taskId, week, day) => {
    try {
        let queryText = `UPDATE ${TABLE_NAME_TASKS_OCCURENCES} SET day = $3 WHERE id = $1 AND week = $2;`;
        let queryValues = [taskId, week, day];
        await pool.query(queryText, queryValues);
        console.log(`updateDayOfWeekOfTask : Updated to row(${taskId},${week},${day}) in table ${TABLE_NAME_TASKS_OCCURENCES}`);
    }
    catch(e) {
        console.log(e);
        console.log(`updateDayOfWeekOfTask : Error when tried to update with ${taskId} , ${week} , ${day}`);
    }
}

exports.deleteTask = async (taskId) => {
    try {
        let queryText = `DELETE FROM ${TABLE_NAME_TASKS_OCCURENCES} WHERE id = $1`;
        let queryValues = [taskId];
        await pool.query(queryText, queryValues);
        console.log(`deleteTask : delete all row with id ${taskId} in table ${TABLE_NAME_TASKS_OCCURENCES}`);
        queryText = `DELETE FROM ${TABLE_NAME_TASKS} WHERE id = $1`;
        queryValues = [taskId];
        await pool.query(queryText, queryValues);
        console.log(`deleteTask : delete row with id ${taskId} in table ${TABLE_NAME_TASKS}`);
    }
    catch(e) {
        console.log(e);
        console.log(`deleteTask : Error when tried to delete rows referencing id ${taskId}`);
    }
}

exports.deleteWeekOfTask = async (taskId, week) => {
    let queryText = `DELETE FROM ${TABLE_NAME_TASKS_OCCURENCES} WHERE id = $1 AND week = $2`;
    let queryValues = [taskId,week];
    await pool.query(queryText, queryValues);
    console.log(`deleteTask : delete row with id ${taskId} and week ${week} in table ${TABLE_NAME_TASKS_OCCURENCES}`);
}

exports.getAllTasks = async () => {
    try {
        let { rows } = await pool.query(`SELECT * FROM ${TABLE_NAME_TASKS};`);
        console.log(`getAllTasks : get all tasks ${TABLE_NAME_TASKS}`);
        return rows;
    }
    catch(e) {
        console.log(e);
        console.log(`getAllTasks : Error when tried to access all tasks in ${TABLE_NAME_TASKS}`);
        return null;
    }
}

exports.getTaskOccurences = async (taskId) => {
    try {
        let { rows } = await pool.query(`SELECT * FROM ${TABLE_NAME_TASKS_OCCURENCES} WHERE id = ${taskId};`);
        console.log(`getTaskOccurences : get all tasks from ${TABLE_NAME_TASKS_OCCURENCES} with id = ${taskId}`);
        return rows;
    }
    catch(e) {
        console.log(e);
        console.log(`getTaskOccurences : Error when tried to access tasks in ${TABLE_NAME_TASKS_OCCURENCES} with id = ${taskId}`);
        return null;
    }
}

exports.getTasksOfCurrentWeek = async (currentWeek) => {
    // access weekly-tasks table and get all entries of the currentWeek
}

exports.setTasksOfCurrentWeek = async (currentWeek)  => {
    // access weekly-tasks and add all tasks that should be in at the currentWeek
}


function getUnusedIds(rows) {
    for (let i = 0; i < MAX_ID; i++) {
        let exists = false;
        rows.forEach(row => {
            if (row.id == i) exists = true;
        });
        if (!exists) return i;
    }
}