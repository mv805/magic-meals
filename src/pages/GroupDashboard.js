import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MenuHeader from "../components/MenuHeader";
import navPages from "../nav-directory";
import { auth, db } from "../firebase_setup/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Foods from "../components/Foods";
import uniqid from "uniqid";
import "./GroupDash.scss";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { GroupDescriptionInput, TitleEditInput } from "../form/inputs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Disclaimer from "../components/Disclaimer";
import LoadingSpinner from "../components/LoadingSpinner";

const GroupDashboard = () => {
  let { userId, groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(undefined);
  const [currentGroupName, setCurrentGroupName] = useState(undefined);
  const [currentGroupDescription, setCurrentGroupDescription] =
    useState(undefined);
  const [groupFoods, setGroupFoods] = useState(undefined);

  useEffect(() => {
    onAuthStateChanged(auth, (userFetched) => {
      if (userFetched && userFetched.uid === userId) {
        setUser(userFetched);
      } else {
        navigate(`${navPages.Main}`);
      }
    });
  }, [navigate, userId]);

  //fetch the group data from reference param and set it
  useEffect(() => {
    async function setGroupData() {
      const groupDocRef = await doc(db, "userGroups", groupId);
      const groupDocSnap = await getDoc(groupDocRef);
      setGroup(groupDocSnap.data());
      setCurrentGroupName(groupDocSnap.data().groupName);
      setCurrentGroupDescription(groupDocSnap.data().description);

      const foodData = [];
      const foodQuery = await query(
        collection(db, "foods"),
        where("userGroup", "==", groupId)
      );
      const foodSnap = await getDocs(foodQuery);
      foodSnap.forEach((food) =>
        foodData.push({
          id: food.id,
          title: food.data().title,
          description: food.data().description,
          danger: food.data().danger,
          userGroup: food.data().userGroup,
        })
      );

      foodData.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      });

      setGroupFoods(foodData);
    }
    if (!group) {
      setGroupData();
    }
  }, [group, groupId, setGroup]);

  //make sure the user can view the group referenced in URL
  useEffect(() => {
    if (group && !group.users.includes(auth.currentUser.email)) {
      navigate(`${navPages.Main}`);
    }
  });

  useEffect(() => {
    if (group && user) {
      setIsLoading(false);
    }
  }, [group, user]);

  const loading = (
    <>
      <MenuHeader />
      <LoadingSpinner />
    </>
  );

  const groupDescriptionEditForm = (
    <>
      <Formik
        initialValues={{
          description: group ? currentGroupDescription : "",
        }}
        validationSchema={Yup.object({
          description: Yup.string()
            .max(1000, "Must be 1000 characters or less")
            .required("A group name is required."),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          await setDoc(
            doc(db, "userGroups", groupId),
            {
              description: values.description,
            },
            { merge: true }
          );
          setIsEditing(undefined);
          setCurrentGroupDescription(values.description);
        }}
      >
        <Form>
          <GroupDescriptionInput
            name="description"
            type="text"
            label="About:"
          />
          <div className="edit-title">
            <button
              className="secondary"
              onClick={() => {
                setIsEditing(undefined);
              }}
            >
              Cancel
            </button>
            <button type="submit">Submit</button>
          </div>
        </Form>
      </Formik>
    </>
  );

  const groupNameEditForm = (
    <>
      <Formik
        initialValues={{
          groupName: group ? group.groupName : "",
        }}
        validationSchema={Yup.object({
          groupName: Yup.string()
            .max(30, "Must be 30 characters or less")
            .required("A group name is required."),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          await setDoc(
            doc(db, "userGroups", groupId),
            {
              groupName: values.groupName,
            },
            { merge: true }
          );
          setIsEditing(undefined);
          setCurrentGroupName(values.groupName);
        }}
      >
        <Form>
          <h6 style={{ margin: 0 }}>Group Name:</h6>
          <TitleEditInput name="groupName" type="text" />
          <div className="edit-title">
            <button
              className="secondary"
              onClick={() => {
                setIsEditing(undefined);
              }}
            >
              Cancel
            </button>
            <button type="submit">Submit</button>
          </div>
        </Form>
      </Formik>
    </>
  );

  const fullPage = (groupRef) => {
    return (
      <>
        <MenuHeader home logoutButton />
        <main className="container">
          <Disclaimer />
          {isEditing !== "group name" && (
            <>
              <div className="group-title">
                <h6 style={{ margin: 0 }}>Group Name:</h6>
                <button
                  className="outline secondary edit-button"
                  onClick={() => {
                    setIsEditing("group name");
                  }}
                >
                  <FontAwesomeIcon icon={["fas", "pen-to-square"]} />
                </button>
              </div>
              <h1 style={{ margin: 0 }}>{currentGroupName}</h1>
            </>
          )}
          {isEditing === "group name" && groupNameEditForm}

          <article>
            {/* the about header */}
            {isEditing !== "description" && (
              <div className="about-header">
                <h6 className="about-section">About:</h6>
                <button
                  className="outline secondary edit-button"
                  onClick={() => {
                    setIsEditing("description");
                  }}
                >
                  <FontAwesomeIcon icon={["fas", "pen-to-square"]} />
                </button>
              </div>
            )}

            {/* about section edit form */}
            {isEditing === "description" && groupDescriptionEditForm}

            {/* description info here */}
            {groupRef && isEditing !== "description" && currentGroupDescription}

            {/* list of members */}
            <h6 className="members-section">Group Members:</h6>
            {groupRef &&
              groupRef.users.map((member) => {
                return (
                  <p className="member" key={uniqid()}>
                    {member}
                  </p>
                );
              })}
          </article>
          <Foods
            foods={groupFoods && groupFoods}
            updateGroup={() => {
              setGroup(undefined);
            }}
          />
        </main>
      </>
    );
  };

  return !group ? loading : fullPage(group);
};

export default GroupDashboard;
