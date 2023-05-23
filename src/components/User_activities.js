import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Axios from "axios";
import { useTranslation } from "react-i18next";
import * as dayjs from "dayjs";

export default function User_activities(props) {
  const { user, token } = props;
  const [rows, setRows] = React.useState(null);
  const { t } = useTranslation();
  const columns = [
    { field: "activity", headerName: t("Activity"), width: "200" },
    {
      field: "user",
      headerName: t("User"),
      width: "250",
      valueGetter: (params) => {
        if (params.row.user !== null) return `${params.row.user.email} `;
        else return "";
      },
    },
    {
      field: "time",
      headerName: t("Date"),
      width: "300",
      valueGetter: (params) =>
        `${dayjs(params.row.time || new Date()).format(
          "DD-MMM-YYYY, h:mm A"
        )} `,
    },
    {
      field: "details",
      headerName: t("Details"),
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: "250",
      valueGetter: (params) => {
        if (params.row.payload["key"])
          return `${
            params.row.payload["key"] ||
            params.row.file.nArticle ||
            params.row.fileId
          }`;
        else return `${params.row.payload["route"]} `;
      },
    },
  ];

  React.useEffect(() => {
    Axios.get(process.env.REACT_APP_HOSTNAME + `/activities`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setRows(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  return (
    <div style={{ height: 400 }}>
      {rows && (
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          pageSizeOptions={[25, 50]}
          checkboxSelection
        />
      )}
    </div>
  );
}
