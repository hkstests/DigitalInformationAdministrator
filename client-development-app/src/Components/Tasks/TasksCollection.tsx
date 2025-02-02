import TaskElement from "./TaskElement";
import { makeStyles } from "@material-ui/core"
import Users from "../../Classes/Users";
import User from "../../Classes/User";
import TaskAccomplishments from "../../Classes/TaskAccomplishments";

const useStyles = makeStyles({
    root: {
        paddingLeft: "1vw",
        height: "100vh",
        overflowY: "auto",
    }
})

interface Props {
    taskAccomplishments: TaskAccomplishments;
    users: Users;
    selectedUser: User;
}

export default function TasksCollection(props: Props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {
                props.taskAccomplishments.getTaskAccomplishmentsGroupedByImportance().map((groupedTaskAccomplishments) =>
                    <div style={{ marginBottom: "3vh" }}>
                        {groupedTaskAccomplishments.map((taskAccomplishment) => {
                            return <TaskElement selectedUser={props.selectedUser} users={props.users} taskAccomplishment={taskAccomplishment} />
                        })}
                    </div>
                )
            }
        </div>
    )
}
