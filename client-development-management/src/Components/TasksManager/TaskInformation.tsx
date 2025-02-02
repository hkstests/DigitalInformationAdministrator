import { TaskCalendar } from "./TaskCalendar/TaskCalendar";
import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from "react";
import socket from "../../socket";
import { DialogChangeTaskValue } from "./DialogChangeTaskValue";
import { MENU_ITEMS_SCORES, MENU_ITEMS_IMPORTANCES, MENU_ITEMS_WEEKLY_OCCURENCES } from '../../constants';
import { makeStyles } from "@material-ui/core";
import TaskOccurences from "../../Classes/TaskOccurences";
import Task from "../../Classes/Task";
import { DialogResetCurrentWeekTasks } from "./DialogResetCurrentWeekTasks";


const useStyles = makeStyles({
    text: {
        fontSize: "1.1em",
        display: "flex",
        alignItems: "center"
    },
    textSelectTaskRequest: {
        display: "flex",
        alignItems: "center",
        height: "80vh",
        fontSize: "2em",
    }
})

interface Props {
    selectedTask: Task;
}


export function TaskInformation(props: Props) {
    const [taskOccurences, setTaskOccurences] = useState(null);

    useEffect(() => {
        socket.on("taskOccurences", (taskOccurenceEntries) => {
            let newTaskOccurences = new TaskOccurences(taskOccurenceEntries);
            setTaskOccurences(newTaskOccurences);
        });

        return () => {
            socket.off("taskOccurences");
        }
    }, [])

    useEffect(() => {
        if (props.selectedTask === null) {
            setTaskOccurences(null);
        }
        else {
            socket.emit("getTaskOccurences", { taskId: props.selectedTask.getId() });
        }
    }, [props.selectedTask]);

    const classes = useStyles();

    // if (props.selectedTask == null) {
    //     return <div className={classes.textSelectTaskRequest}>Select a task on the left side</div>
    // }
    let isTaskSelected = props.selectedTask !== null;
    return (
        <React.Fragment>
            <Grid item xs={4}>
                <div className={classes.text}>
                    Weekly Occurences : {isTaskSelected ? props.selectedTask.getWeeklyOccurences() : "-"}
                    {isTaskSelected ?
                        <DialogChangeTaskValue
                            menuItems={MENU_ITEMS_WEEKLY_OCCURENCES}
                            type="Weekly Occurence"
                            k="weeklyOccurences"
                            selectedTask={props.selectedTask}
                        />
                        : ""}
                </div>
            </Grid>
            <Grid item xs={4}>
                <div className={classes.text}>
                    Score : {isTaskSelected ? props.selectedTask.getScore() : "-"}
                    {isTaskSelected ?
                        <DialogChangeTaskValue
                            menuItems={MENU_ITEMS_SCORES}
                            type="Score"
                            k="score"
                            selectedTask={props.selectedTask}
                        />
                        : ""}
                </div>
            </Grid>
            <Grid item xs={3}>
                <div className={classes.text}>
                    Importance : {isTaskSelected ? props.selectedTask.getImportance() : "-"}
                    {isTaskSelected ?
                        <DialogChangeTaskValue
                            menuItems={MENU_ITEMS_IMPORTANCES}
                            type="Importance"
                            k="importance"
                            selectedTask={props.selectedTask}
                        />
                        : ""}
                </div>
            </Grid>
            <Grid item xs={1}>
                <DialogResetCurrentWeekTasks />
            </Grid>

            <Grid item xs={4}>
                <TaskCalendar selectedTask={props.selectedTask} taskOccurences={taskOccurences} month={0} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTask={props.selectedTask} taskOccurences={taskOccurences} month={1} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTask={props.selectedTask} taskOccurences={taskOccurences} month={2} />
            </Grid>


            <Grid item xs={4}>
                <TaskCalendar selectedTask={props.selectedTask} taskOccurences={taskOccurences} month={3} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTask={props.selectedTask} taskOccurences={taskOccurences} month={4} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTask={props.selectedTask} taskOccurences={taskOccurences} month={5} />
            </Grid>

            <Grid item xs={4}>
                <TaskCalendar selectedTask={props.selectedTask} taskOccurences={taskOccurences} month={6} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTask={props.selectedTask} taskOccurences={taskOccurences} month={7} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTask={props.selectedTask} taskOccurences={taskOccurences} month={8} />
            </Grid>

            <Grid item xs={4}>
                <TaskCalendar selectedTask={props.selectedTask} taskOccurences={taskOccurences} month={9} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTask={props.selectedTask} taskOccurences={taskOccurences} month={10} />
            </Grid>
            <Grid item xs={4}>
                <TaskCalendar selectedTask={props.selectedTask} taskOccurences={taskOccurences} month={11} />
            </Grid>
        </React.Fragment>
    )
}