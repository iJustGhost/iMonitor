import React, { useState } from "react";
import * as XLSX from "xlsx";
import DataExcelConfig from "./DataExcelConfig";

function BatchUpload({ visible, close }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dataHolder, setDataHolder] = useState();
  const [displayData, setDisplayData] = useState(false);

  const readExcel = async (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Now you have the Excel data in `jsonData`.
        setDataHolder(jsonData);
        setDisplayData(!displayData);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  function closemodal() {
    setSelectedFile();
    setDataHolder();
    setDisplayData(false);
    close(!visible);
  }

  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white h-[600px] w-[700px] rounded-md text-black flex-col flex place-content-center">
        <div className="h-[570px] w-[100%]  flex flex-col p-1">
          <input
            onChange={readExcel}
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />

          <div className="bg-slate-200 h-[550px] p-1 rounded-sm mt-1">
            {displayData ? (
              <div className="grid grid-cols-5 p-1 font-semibold">
                <label>FirstName</label>
                <label>M.I</label>
                <label>LastName</label>
                <label>Program</label>
                <label>Setion</label>
              </div>
            ) : (
              <div>Data will be display here</div>
            )}
            {displayData && (
              <div className="">
                {dataHolder.map((data, index) => (
                  <DataExcelConfig key={index} data={data} />
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => handleUpload()}
            className="bg-blue-900 hover:bg-opacity-[40%] bg-opacity-[70%] h-fit p-2 "
          >
            Check File
          </button>
        </div>
        <a
          onClick={() => closemodal()}
          className="hover:text-red-500 hover:underline text-lg font-semibold cursor-pointer flex justify-center"
        >
          CLOSE
        </a>
      </div>
    </div>
  );
}

export default BatchUpload;
