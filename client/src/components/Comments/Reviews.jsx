import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextareaDecorators from "./TextareaDecorators";
import Stars from "./Stars";
import theme from "../../../theme";
import { useAuthStore } from "../../store/authStore";
import { useProductsStore } from "../../store/productsStore";

const Reviews = (props) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(3.5);
  const { user } = useAuthStore();
  const userId = user.id_user;
  const productId = props.idProduct;
  const productStore = useProductsStore();

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleSubmitReview = () => {
    console.log("Rating:", rating);
    console.log("Comment:", comment);
    console.log("Idproducto",productId)
    console.log("UserId", userId);
    // Puedes enviar la información a tu backend o realizar otras acciones necesarias
    productStore.submitReview(productId, comment, rating, userId);
    setComment("");

    
  };

  return (
    <div style={{minWidth:"25%", marginTop:"-4vh"}}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <TextareaDecorators setComment={setComment} comment={comment} />{" "}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            gap: "2rem",
          }}
        >
          <Stars value={rating} onChange={handleRatingChange} />
          <Button
            size="small"
            sx={{
              marginTop: "-3%",
              height:"min-content",
              backgroundColor: theme.palette.primary.main,
              ":hover": {
                backgroundColor: theme.palette.primary.main,
                filter: "brightness(90%)",
              },
            }}
            type="button"
            variant="contained"
            color="primary"
            onClick={handleSubmitReview}
          >
            Comment
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default Reviews;
