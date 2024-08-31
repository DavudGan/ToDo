import { observer } from "mobx-react-lite";
import TaskStore from "../taskStore/TaskStore";
import TaskItem from "../taskItem/TaskItem";
import ModalAdd from "../modal/Modal";

const TaskTree = observer(() => {
  return (
    <div>
      <ModalAdd iconButton={true} />
      <ul>
        {TaskStore.tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
});

export default TaskTree;
