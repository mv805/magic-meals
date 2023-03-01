import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "./FoodDetail.scss";

const FoodDetail = (props) => {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <details>
      <summary className="food-title">
        {props.food.title}
        {props.food.danger && (
          <div className="food-warning">
            <FontAwesomeIcon icon={["fas", "triangle-exclamation"]} />
          </div>
        )}
      </summary>
      {props.food.danger && (
        <div className="warning-text">WARNING. May contain allergens.</div>
      )}
      <h5 className="description-header">Food Assesment</h5>
      <p>{props.food.description}</p>
      <button onClick={props.isEditing}>Edit</button>

      {!isDeleting && (
        <button
          className="secondary"
          onClick={() => {
            setIsDeleting(true);
          }}
        >
          Delete
        </button>
      )}
      {isDeleting && (
        <>
          <p style={{ textAlign: "center" }}>
            Are you sure you want to delete this food? This action cannot be undone.
          </p>
          <div className="confirm-delete-food">
            <button className="secondary" onClick={() => setIsDeleting(false)}>
              No
            </button>
            <button
              onClick={() => {
                props.deleteFood(props.food.id);
              }}
            >
              Yes
            </button>
          </div>
        </>
      )}
    </details>
  );
};

export default FoodDetail;
