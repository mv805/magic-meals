import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase_setup/firebase";
import uniqid from "uniqid";
import { useNavigate } from "react-router-dom";
import navPages from "../nav-directory";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { TextAreaInput, TextInput } from "../form/inputs";
import "./Groups.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Groups = (props) => {
  const [groups, setGroups] = useState(undefined);
  const [user, setUser] = useState(props.user);
  const [addingGroup, setAddingGroup] = useState(false);
  const navigate = useNavigate();
  const [groupDeleting, setGroupDeleting] = useState(undefined);

  useEffect(() => {
    async function queryGroups(user) {
      const groupData = [];
      const groupQuery = await query(
        collection(db, "userGroups"),
        where("users", "array-contains", user.email)
      );
      const groupSnap = await getDocs(groupQuery);
      groupSnap.forEach((group) =>
        groupData.push({
          id: group.id,
          groupName: group.data().groupName,
        })
      );

      setGroups(groupData);
    }

    if (!groups) {
      queryGroups(user);
    }
  });

  const changeToGroup = (userId, groupId) => {
    navigate(`${navPages.Group(userId, groupId)}`);
  };

  const addNewGroup = async ({ groupName, description }) => {
    await addDoc(collection(db, "userGroups"), {
      groupName,
      description,
      users: [user.email],
    });
  };

  const deleteGroup = async (groupId) => {
    await deleteDoc(doc(db, "userGroups", groupId));
    setGroups(undefined);
  };

  const newGroupForm = (
    <article>
      <h3>Add a New Group</h3>
      <Formik
        initialValues={{
          groupName: "",
          description: "",
        }}
        validationSchema={Yup.object({
          groupName: Yup.string()
            .max(30, "Must be 30 characters or less")
            .required("A group name is required."),
          description: Yup.string()
            .max(1000, "Must be 1000 characters or less")
            .required("A group description is required."),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          await addNewGroup(values);
          setAddingGroup(false);
          setGroups(undefined);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <TextInput
              label="Group Name"
              name="groupName"
              type="text"
              placeholder="Enter name..."
            />
            <TextAreaInput
              label="Description"
              name="description"
              type="text"
              rows="5"
              placeholder="Enter description"
            />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </article>
  );

  const userGroupSelectionButtons = (groupData, userSelectingId) => {
    return groupData.map((group) => {
      return (
        <article key={uniqid()}>
          <h3 className="group-title">{group.groupName}</h3>
          <p className="id-indicator">Group ID#: {group.id}</p>
          <button onClick={(e) => changeToGroup(userSelectingId, group.id)}>
            Select
          </button>
          {groupDeleting === group.id && (
            <>
              <h4>Are you sure you want to delete this group?</h4>
              <p className="confirm-delete-warning">
                All data will be lost. This action cannot be undone.
              </p>
              <div className="delete-confirm">
                <button
                  className="secondary"
                  onClick={() => setGroupDeleting(undefined)}
                >
                  No
                </button>
                <button
                  className="secondary confirm-group-delete"
                  onClick={() => deleteGroup(group.id)}
                >
                  Yes
                </button>
              </div>
            </>
          )}
          {groupDeleting !== group.id && (
            <button
              className="secondary"
              onClick={() => setGroupDeleting(group.id)}
            >
              <FontAwesomeIcon icon={["fas", "trash-can"]} /> Delete
            </button>
          )}
        </article>
      );
    });
  };

  const groupDisplay = (groupData, userData) => {
    return (
      <>
        {groupData.length ? (
          userGroupSelectionButtons(groupData, userData.uid)
        ) : (
          <article style={{ textAlign: "center" }}>
            No groups found. Please add one to begin.
          </article>
        )}
        {addingGroup && newGroupForm}
        <button
          className="contrast"
          onClick={(e) => {
            setAddingGroup((prev) => !prev);
          }}
        >
          {!addingGroup ? `Create New Group+` : `Cancel Creation`}
        </button>
      </>
    );
  };

  return groups ? groupDisplay(groups, user) : null;
};

export default Groups;
