import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Post, User, getUserPost } from "../services/users";
import { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function UserDetails(props: { user: User | null }) {
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [posts, setPosts] = useState<Post[]>([]);
  const getPosts = async () => {
    if (!props.user?.id) return;
    const response = await getUserPost<Post[]>(props.user?.id);
    setPosts(response.data);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {props.user?.name}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Email: {props.user?.email}
        </Typography>
        <Typography sx={{ mt: 2 }}>Gender: {props.user?.gender}</Typography>
        <Typography sx={{ mt: 2 }}>Status: {props.user?.status}</Typography>
        <Typography sx={{ mt: 2 }}>
          Post: {posts.length < 1 ? "This user has no posts." : ""}
        </Typography>
        <br />
        {posts.map((post) => (
          <Accordion key={post.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: "33%", flexShrink: 0 }}>
                {post.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{post.body}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </>
  );
}
