import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

import DropDown from "../dropdown/Dropdown";

import "./Table.scss";

const Table = ({
  headers,
  attributes,
  data,
  checkbox,
  dropdown,
  dropDown,
  onSelection,
}) => {
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (data && data?.length !== 0) {
      setItems((prev) => data?.map((item) => ({ ...item, isChecked: false })));
    }
  }, [data]);

  useEffect(() => {
    onSelection(items?.filter((item) => item?.isChecked));
  }, [items]);

  const onSelectAllHandler = (e) => {
    setIsAllChecked(e.target.checked);

    setItems((prev) =>
      items?.map((item) => ({ ...item, isChecked: e.target.checked }))
    );
  };

  const onSelectHandler = (e, id) => {
    const tempData = items?.map((item) => {
      if (item?.id === id) return { ...item, isChecked: e.target.checked };
      else return item;
    });

    const selectedItems = tempData?.filter((item) => item?.isChecked);

    setItems(tempData);

    if (selectedItems?.length === items?.length) {
      setIsAllChecked(true);
    } else setIsAllChecked(false);
  };

  return (
    <table
      border="0"
      // cellspacing="0" cellpadding="100%"
    >
      <thead>
        <tr>
          {checkbox && (
            <th className="checkbox">
              <Form.Check
                type="checkbox"
                checked={isAllChecked}
                onChange={onSelectAllHandler}
              />
            </th>
          )}
          {headers?.map((header) => (
            <th key={header}>{header}</th>
          ))}
          {dropdown && <th className="dropdown"></th>}
          {dropDown && <th className="dropdown"></th>}
        </tr>
      </thead>
      <tbody>
        {items &&
          items?.map((item) => (
            <tr key={item?.id}>
              {checkbox && (
                <td className="checkbox">
                  <Form.Check
                    type="checkbox"
                    checked={item?.isChecked}
                    onChange={(e) => onSelectHandler(e, item?.id)}
                  />
                </td>
              )}
              {attributes?.map((attribute) => (
                <td key={item?.id + ":" + attribute}>{item[attribute]}</td>
              ))}
              {dropdown && (
                <td className="dropdown">
                  <DropDown
                    disabled={item?.isChecked || isAllChecked}
                    variant="secondary"
                    icon={dropdown?.icon}
                    items={Object.entries(dropdown?.items)?.map(
                      ([key, value]) => ({
                        title: value,
                        onClick: () => dropdown?.onClick(key, item),
                      })
                    )}
                  />
                </td>
              )}

              {dropDown && (
                <td className="dropdown">
                  <DropDown
                    disabled={item?.isChecked || isAllChecked}
                    variant="secondary"
                    icon={dropDown(item)?.icon}
                    items={dropDown(item)?.items?.map((dropdownItem) => ({
                      ...dropdownItem,
                      onClick: () =>
                        dropDown(item)?.onClick(dropdownItem?.key, item),
                    }))}
                  />
                </td>
              )}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default Table;
