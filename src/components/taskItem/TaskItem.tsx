import { observer } from "mobx-react-lite";
import { Task } from "../taskStore/TaskStore";
import Checkbox from "@mui/material/Checkbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface TaskItemProps {
  task: Task;
  level?: number;
}


const TaskItem = observer(({ task, level = 0 }: TaskItemProps) => {
  
  // Обработчик для переключения состояния "развернуто/свернуто" задачи
  const handleToggleExpand = () => {
    
  };

  return (
    <List disablePadding>

      {/* Кнопка для развертывания/свертывания подзадач */}
      <ListItem sx={{ pl: level * 5 }}> {/* Отступ увеличивается с каждым уровнем вложенности */}
        {task.subtasks.length > 0 && (
          <IconButton onClick={handleToggleExpand}>
            {/* Иконка зависит от состояния развернутости задачи */}
            {task.isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}

        {/* Текст задачи */}
        <ListItemText
          sx={{ pl: 1 }} // Отступ между иконкой и текстом
          primary={task.title}
          // onClick={}
        />

        {/* Чекбокс для отметки завершенности задачи */}
        <Checkbox
          indeterminate={!task.isComplete}
          checked={task.isComplete}
          // onChange={}
        />
      </ListItem>

      {/* Список подзадач, который сворачивается/разворачивается */}
      {task.subtasks.length > 0 && (
        <Collapse in={task.isExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {task.subtasks.map((subtask) => (
              <TaskItem key={subtask.id} task={subtask} level={level + 1} />
            ))}
          </List>
        </Collapse>
      )}
    </List>
  );
});

export default TaskItem;
