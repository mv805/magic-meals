import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import uniqid from "uniqid";
import { DangerCheckbox, TextAreaInput, TextInput } from "../form/inputs";
import FoodDetail from "./FoodDetail";
import * as Yup from "yup";
import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase_setup/firebase";
import { useParams } from "react-router-dom";

const Foods = (props) => {
  let { userId, groupId } = useParams();
  const [foods, setFoods] = useState(undefined);
  const [isEditing, setIsEditing] = useState(undefined);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (props.foods) {
      setFoods(props.foods);
    }
  }, [props.foods]);

  const deleteFood = async (foodId) => {
    await deleteDoc(doc(db, "foods", foodId));
    setIsEditing(undefined);
    props.updateGroup();
  };

  const foodCreationForm = () => (
    <>
      <Formik
        initialValues={{
          title: "",
          description: "",
          danger: true,
        }}
        validationSchema={Yup.object({
          title: Yup.string()
            .max(30, "Must be 30 characters or less")
            .required("A group name is required."),
          description: Yup.string()
            .max(1000, "Must be 1000 characters or less")
            .required("A group description is required."),
          danger: Yup.boolean(),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          await addDoc(collection(db, "foods"), {
            title: values.title,
            danger: values.danger,
            description: values.description,
            userGroup: groupId,
          });
          setIsAdding(false);
          props.updateGroup();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <TextInput
              label="Food Title"
              name="title"
              type="text"
              placeholder="Enter a title"
            />
            <TextAreaInput
              label="Description"
              name="description"
              type="text"
              rows="5"
              placeholder="Enter description"
            />
            <DangerCheckbox name="danger">Contains Allergen</DangerCheckbox>
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
      <button className="secondary" onClick={() => setIsAdding(false)}>
        Cancel
      </button>
    </>
  );

  const foodEditForm = (id, title, danger, description, userGroup) => (
    <>
      <Formik
        initialValues={{
          title: title,
          description: description,
          danger: danger,
        }}
        validationSchema={Yup.object({
          title: Yup.string()
            .max(30, "Must be 30 characters or less")
            .required("A group name is required."),
          description: Yup.string()
            .max(1000, "Must be 1000 characters or less")
            .required("A group description is required."),
          danger: Yup.boolean(),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          await setDoc(
            doc(db, "foods", id),
            {
              title: values.title,
              danger: values.danger,
              description: values.description,
              userGroup: userGroup,
            },
            { merge: true }
          );
          setIsEditing(undefined);
          props.updateGroup();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <TextInput
              label="Food Title"
              name="title"
              type="text"
              placeholder="Enter a title"
            />
            <TextAreaInput
              label="Description"
              name="description"
              type="text"
              rows="5"
              placeholder="Enter description"
            />
            <DangerCheckbox name="danger">Contains Allergen</DangerCheckbox>
            <button type="submit" disabled={isSubmitting}>Submit</button>
          </Form>
        )}
      </Formik>
      <button className="secondary" onClick={() => setIsEditing(undefined)}>
        Cancel
      </button>
    </>
  );

  const foodDisplay = (
    <>
      <article>
        Below is a list of all assesed food items and recipes. Please add more
        or update as necessary.
      </article>
      <article>
        <h4>Foods and Recipes</h4>
        <footer>
          {foods && !foods.length && (
            <p>No Foods Assesed Yet. Please add one.</p>
          )}
          {foods &&
            foods.map((food) => {
              return (
                <div key={uniqid()}>
                  {isEditing !== food.id && (
                    <FoodDetail
                      food={food}
                      deleteFood={(e) => {
                        deleteFood(e);
                      }}
                      isEditing={() => {
                        setIsEditing(food.id);
                      }}
                    />
                  )}
                  {isEditing === food.id &&
                    foodEditForm(
                      food.id,
                      food.title,
                      food.danger,
                      food.description,
                      food.userGroup
                    )}
                </div>
              );
            })}
        </footer>
      </article>
      {!isAdding && (
        <button onClick={() => setIsAdding(true)}>Add New Food/Recipe+</button>
      )}
      {isAdding && <article>{foodCreationForm()}</article>}
    </>
  );

  return foods ? foodDisplay : <p>loading...</p>;
};

export default Foods;
