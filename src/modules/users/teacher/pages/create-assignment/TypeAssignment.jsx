import React, { useState, useEffect, useRef } from "react";
import { convert } from "html-to-text";
import { useNavigate } from "react-router-dom";
import {
  BlobProvider,
  Document,
  Image,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

import { useCreateAssignmentMutation } from "redux/users/teacherSlice";

import Header from "components/ui/header/Header";
import Footer from "components/ui/footer/Footer";
import Button from "components/ui/button/Button";
import JoditEditor from "jodit-react";
import { Slide, toast } from "react-toastify";

const TypeAssignment = () => {
  const navigator = useNavigate();
  const editor = useRef(null);

  const [content, setContent] = useState(() => localStorage.getItem("content"));
  const [download, setDownload] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [assignmentData, setAssignmentData] = useState(() =>
    JSON.parse(localStorage.getItem("type-assignment-details"))
  );

  useEffect(() => {
    if (!assignmentData || assignmentData === {}) {
      toast("Fill in the assignment details first.", {
        type: "info",
        transition: Slide,
      });
      navigator("/");
    }
  }, []);

  if (!assignmentData || assignmentData === {}) {
    return null;
  }

  const handleClick = () => {
    // console.log(assignmentData);
    localStorage.setItem("content", content);
    setButtonClicked(true);
    // setTimeout(() => {
    //   setButtonClicked(false);
    // }, 1000);
  };

  return (
    <div className="container-wrapper teacher-create-assignment-type">
      {download && (
        <Blob
          assignmentData={assignmentData}
          MyDocument={
            <MyDocument
              content={content}
              year={assignmentData?.year}
              branch={assignmentData?.branch}
              section={assignmentData?.section}
              semester={assignmentData?.semester}
              subject={assignmentData?.subject}
              title={assignmentData?.title}
            />
          }
        />
      )}
      <Header
        title={assignmentData?.title}
        subTitle={
          assignmentData?.subject +
          " - (" +
          assignmentData?.year +
          "-" +
          assignmentData?.edu_year +
          "-" +
          assignmentData?.branch +
          "-" +
          assignmentData?.section +
          "-" +
          assignmentData?.semester +
          ")"
        }
        rightChildren={
          <>
            <Button onClick={handleClick}>
              {buttonClicked ? "Saved" : "Save for Later"}
            </Button>
          </>
        }
      />
      <section>
        <JoditEditor
          ref={editor}
          value={content}
          tabIndex={1} // tabIndex of textarea
          // onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
          onChange={(newContent) => {
            setContent(newContent);
          }}
        />
      </section>
      <Footer
        rightChildren={
          <>
            <Button onClick={() => setDownload(true)}>Create Assignment</Button>
          </>
        }
      />
    </div>
  );
};

export default TypeAssignment;

const styles = StyleSheet.create({
  page: {
    // flexDirection: 'row',
    backgroundColor: "white",
  },
  title: {
    width: "100%",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "15px 30px",
    fontSize: "16px",
  },
  heading: {
    flexDirection: "row",
    justifyContent: "center",
    padding: "15px 30px",
  },
  questions: {
    fontSize: "10px",
    flexDirection: "row",
    justifyContent: "center",
    padding: "15px 30px",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

export const MyDocument = ({
  content,
  year,
  branch,
  section,
  semester,
  subject,
  title,
}) => {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.title}>
          <Image source="./clg.png"></Image>
        </View>

        <View style={styles.details}>
          <View>
            <Text>
              For: {year}-{branch}-{section} Sem:{semester}(2019){" "}
            </Text>
          </View>
          <View>
            <Text>Subject: {subject}</Text>
          </View>
        </View>

        <View style={styles.heading}>
          <Text>{title}</Text>
        </View>

        <View style={styles.questions}>
          <Text>{convert(content)}</Text>
        </View>
      </Page>
    </Document>
  );
};

const Blob = ({ MyDocument, assignmentData }) => {
  const navigator = useNavigate();

  const [createAssignment] = useCreateAssignmentMutation();

  return (
    <div>
      <BlobProvider document={MyDocument}>
        {({ blob, url, loading, error }) => {
          if (!blob) return;

          const formData = new FormData();
          for (let key of Object.keys(assignmentData)) {
            formData.set(key, assignmentData[key]);
          }
          formData.set("edu_year", 4);
          formData.set("year", 2019);
          formData.set("file", blob);
          let date = Date();

          let dateModified = date.split(" ").slice(0, 6).join(" ");
          formData.set("date", dateModified);
          let tdueDate = new Date(assignmentData.due_date);

          dateModified = tdueDate.toString().split(" ").slice(0, 6).join(" ");

          formData.set("due_date", dateModified);
          // formData.append('file', blob);

          createAssignment(formData);
          //   axios
          //     .post("http://localhost:8000/api/create-assignment", formData, {
          //       headers: {
          //         "Content-Type": "applications/json",
          //         Authorization: `Bearer ${localStorage.getItem("access")}`,
          //       },
          //     })
          //     .then((res) => {
          //       console.log(res);
          //     });
          //   localStorage.removeItem('content')
          //   localStorage.removeItem('type-assignment-details')
          // navigator('/');
        }}
      </BlobProvider>
    </div>
  );
};
