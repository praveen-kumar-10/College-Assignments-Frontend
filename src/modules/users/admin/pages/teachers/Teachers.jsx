import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import debounce from "lodash.debounce";

import { ReactComponent as RefreshIcon } from "assets/icons/refresh.svg";
import { ReactComponent as MoreVertical } from "assets/icons/more-vertical.svg";

import Header from "components/ui/header/Header";
import DropDown from "components/ui/dropdown/Dropdown";
import Table from "components/ui/table/Table";
import {
  useApproveOrDisapproveTeacherMutation,
  useGetTeachersQuery,
} from "redux/admin/adminSlice";
import Tooltip from "components/ui/tooltip/Tooltip";
import ComponentLoader from "components/ui/ComponentLoader";
import Button from "components/ui/button/Button";
import { useDispatch } from "react-redux";
import { setIsLoading } from "redux/uiReducer";

const Teachers = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [data, setData] = useState([]);

  const {
    data: teachersResponse,
    isLoading: isTeachersLoading,
    error: teachersError,
    refetch: refetchTeachers,
  } = useGetTeachersQuery();

  const [approveOrDisapproveTeacher, { isLoading: isApprovingOrDisapproving }] =
    useApproveOrDisapproveTeacherMutation();

  useEffect(() => {
    dispatch(setIsLoading(isApprovingOrDisapproving));
  }, [dispatch, isApprovingOrDisapproving]);

  useEffect(() => {
    setData(teachersResponse?.teachers);
  }, [teachersResponse]);

  useEffect(() => {
    if (teachersResponse?.teachers) {
      if (query !== "") {
        setData((prev) =>
          teachersResponse?.teachers?.filter((teacher) =>
            ["name", "phone", "mail"].some((key) =>
              teacher[key].toLowerCase().includes(query)
            )
          )
        );
      } else setData(teachersResponse?.teachers);
    }
  }, [query, teachersResponse?.teachers]);

  const onChangeQuery = debounce((e) => setQuery(e.target.value), 200);

  const onSelection = (data) => setSelectedItems(data);

  const onTableAction = (action, item) => {
    switch (action) {
      case "approve":
        approveOrDisapproveTeacher({ id: item?.id, approve: true });
        break;
      case "disapprove":
        approveOrDisapproveTeacher({ id: item?.id, approve: false });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Helmet>
        <title>Assignments | Admin - Teachers</title>
      </Helmet>
      <div className="container-wrapper admin-teachers-dashboard">
        <Header
          title="Teachers"
          subTitle="Approval/Disapproval"
          search={{
            query,
            onChange: onChangeQuery,
            placeholder: "Search by Name, Mail, Phone...",
          }}
          rightChildren={
            <>
              <Tooltip title="Reload/Refetch the details">
                <Button className="secondary" onClick={() => refetchTeachers()}>
                  <RefreshIcon />
                </Button>
              </Tooltip>
              {/* <DropDown
                variant="secondary"
                icon={<MoreVertical />}
                items={[
                  {
                    title: "Approve",
                    disabled: selectedItems?.length === 0,
                  },
                  {
                    title: "Disapprove",
                    disabled: selectedItems?.length === 0,
                  },
                  {
                    title: "Reload",
                    onClick: () => refetchTeachers(),
                  },
                ]}
              /> */}
            </>
          }
        />
        <ComponentLoader
          {...{
            isLoading: isTeachersLoading,
            error: teachersError,
            isEmpty: data?.length === 0,
          }}
        />
        {!isTeachersLoading && !teachersError && data?.length !== 0 && (
          <section>
            <Table
              checkbox
              data={data}
              onSelection={onSelection}
              headers={[
                "name",
                "department",
                "job title",
                "mail",
                "phone",
                "gender",
              ]}
              attributes={[
                "name",
                "department",
                "job_title",
                "mail",
                "phone",
                "gender",
              ]}
              dropDown={(item) => ({
                icon: <MoreVertical />,
                items: [
                  {
                    title: "Approve",
                    key: "approve",
                    disabled: item?.approved,
                  },
                  {
                    title: "Disapprove",
                    key: "disapprove",
                    disabled: !item?.approved,
                  },
                ],
                onClick: onTableAction,
              })}
            />
          </section>
        )}
      </div>
    </>
  );
};

export default Teachers;
