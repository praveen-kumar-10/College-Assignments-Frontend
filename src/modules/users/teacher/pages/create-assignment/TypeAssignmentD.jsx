import JoditEditor from "jodit-react";
import React, { useEffect, useRef, useState } from "react";
import Button from "components/ui/button/Button";
import { convert } from "html-to-text";

import {
  BlobProvider,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  //   PDFViewer,
  Image,
} from "@react-pdf/renderer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { useCreateAssignmentMutation } from "redux/reducers/teacherSlice";
// import { toast } from "react-toastify";

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

export default function TypeAssignment() {
  const [content, setContent] = useState(() => localStorage.getItem("content"));

  const [assignmentData, setAssignmentData] = useState(() =>
    JSON.parse(localStorage.getItem("type-assignment-details"))
  );
  const [download, setDownload] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const navigator = useNavigate();

  useEffect(() => {
    if (!assignmentData || assignmentData === {}) {
      alert("Fill in the assignment details first.");
      navigator("/");
    }
  }, []);

  if (!assignmentData || assignmentData === {}) {
    return null;
  }

  const handleClick = () => {
    localStorage.setItem("content", content);
    setButtonClicked(true);
    setTimeout(() => {
      setButtonClicked(false);
    }, 1000);
  };

  return (
    <div style={{ width: "100%" }}>
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
      <header>
        <div className="header__left">
          <span>
            <h1 className="m-0">
              {assignmentData?.title}/{assignmentData?.subject}
            </h1>
          </span>
          <span className="text-white">
            <p>
              (2019-{assignmentData?.year}-{assignmentData?.branch}-
              {assignmentData?.section}-{assignmentData?.semester} )
            </p>
          </span>
        </div>
        <div className="header__right">
          <Button
            style={{ margin: "0px 10px" }}
            text="Download"
            onClick={() => setDownload(true)}
          >
            Download
          </Button>
          <Button
            style={{ margin: "0px 10px" }}
            text={` ${buttonClicked ? "Saved" : "Save"} `}
            onClick={handleClick}
          >
            {` ${buttonClicked ? "Saved" : "Save"} `}
          </Button>
        </div>
      </header>
      <div
        style={{
          color: "white",
          margin: "10px",
          borderBottom: "5px solid white",
        }}
      >
        <h1>Type Assignment</h1>
      </div>
      <Form content={content} setContent={setContent} />
    </div>
  );
}

export function Form({ content, setContent }) {
  const editor = useRef(null);

  const saveText = () => {
    localStorage.setItem("content", content);
    alert("Saved");
  };

  return (
    <div>
      <JoditEditor
        ref={editor}
        value={content}
        tabIndex={1} // tabIndex of textarea
        // onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
        onChange={(newContent) => {
          setContent(newContent);
        }}
      />
    </div>
  );
}

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
          <Image source="assets/clg.png"></Image>
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

export const Blob = ({ MyDocument, assignmentData }) => {
  const navigator = useNavigate();

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
          // console.log(URL.createObjectURL(blob));
          let date = Date();

          let dateModified = date.split(" ").slice(0, 6).join(" ");
          formData.set("date", dateModified);
          let tdueDate = new Date(assignmentData.due_date);

          dateModified = tdueDate.toString().split(" ").slice(0, 6).join(" ");

          formData.set("due_date", dateModified);

          console.log(formData);

          // formData.append('file', blob);
          axios
            .post("http://localhost:8000/api/create-assignment", formData, {
              headers: {
                "Content-Type": "applications/json",
                Authorization: `Bearer ${JSON.parse(
                  localStorage.getItem("access")
                )}`,
              },
            })
            .then((res) => {
              console.log(res);
            });
          localStorage.removeItem("content");
          localStorage.removeItem("type-assignment-details");
          navigator("/teacher");
        }}
      </BlobProvider>
    </div>
  );
};
