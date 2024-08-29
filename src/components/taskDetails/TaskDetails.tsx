import { FC } from "react";
import { observer } from "mobx-react-lite";
import TaskStore from "../taskStore/TaskStore";

const TaskDetails: FC = observer(() => {
  if (!TaskStore.selectedTask) {
    return <div>Выбери задачу чтобы получить подробную информацию</div>;
  }

  return (
    <div>
      <h2>{TaskStore.selectedTask.title}</h2>
      <p>{TaskStore.selectedTask.description}</p>
    </div>
  );
});

export default TaskDetails;
