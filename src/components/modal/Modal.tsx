import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import "./ModalScss.scss";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import TaskStore, { Task } from "../taskStore/TaskStore";
import { nanoid } from "nanoid";

interface ModalAddProps {
  id?: string;
  iconButton?: boolean;
  editTask?: boolean;
}

const ModalAdd = observer(
  ({ id, iconButton = false, editTask = false }: ModalAddProps) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const idNewTask = nanoid();

    const addTask = () => {
      const newTask = new Task(`${idNewTask}`, title, description);

      TaskStore.addTask(newTask, id);
      setTitle("");
      setDescription("");
      handleClose();
    };

    const setNewDataTask = () => {
      if (id) {
        TaskStore.editTask(id, title, description);
      } else {
        console.error("ID задачи не определен");
      }
      handleClose();
    };

    const style = {
      position: "absolute" as "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      border: "2px solid #000",
      boxShadow: 24,
      p: 4,
    };

    return (
      <div>
        {iconButton ? (
          <Button variant="contained" onClick={() => handleOpen()}>
            Добавить задачу
          </Button>
        ) : (
          <IconButton
            aria-label="add"
            color="success"
            onClick={() => handleOpen()}
          >
            {editTask ? <EditNoteOutlinedIcon /> : <AddIcon />}
          </IconButton>
        )}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Stack
              direction="column"
              spacing={2}
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                {editTask ? "Редактирование задачи" : "Создание задачи"}
              </Typography>
              <TextField
                id="outlined-basic"
                label="Название задачи"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                id="outlined-multiline-flexible"
                label="Описание задачи"
                multiline
                maxRows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Button
                variant="contained"
                color="success"
                onClick={editTask ? setNewDataTask : addTask}
              >
                {editTask ? "Изменить" : "Добавить"}
              </Button>
            </Stack>
          </Box>
        </Modal>
      </div>
    );
  }
);

export default ModalAdd;
