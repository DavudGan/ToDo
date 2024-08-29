import { FC } from "react";
import { observer } from "mobx-react-lite";
import TaskStore from "../taskStore/TaskStore";
import TaskItem from "../taskItem/TaskItem";

const TaskTree: FC = observer(() => {
  return (
    <div>
      <ul>
        {TaskStore.tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
});

export default TaskTree;
