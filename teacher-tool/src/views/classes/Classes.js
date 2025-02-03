import React, { useState } from 'react';
import { CSmartTable } from '@coreui/react-pro';
import { CButton, CButtonGroup } from '@coreui/react';
import { cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';


const tableData = [
  { id: 1, name: 'John Doe', age: 25, class: 'Math' },
  { id: 2, name: 'Jane Smith', age: 30, class: 'Science' },
  { id: 3, name: 'Alice Johnson', age: 28, class: 'History' },
  { id: 1, name: 'John Doe', age: 25, class: 'Math' },
  { id: 2, name: 'Jane Smith', age: 30, class: 'Science' },
  { id: 3, name: 'Alice Johnson', age: 28, class: 'History' },
  { id: 1, name: 'John Doe', age: 25, class: 'Math' },
  { id: 2, name: 'Jane Smith', age: 30, class: 'Science' },
  { id: 3, name: 'Alice Johnson', age: 28, class: 'History' },
];

const tableColumns = [
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
  { key: 'class', label: 'Class' },
  { key: 'actions', label: 'Actions' },
];

const Classes = () => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleEdit = (item) => {
    console.log('Edit:', item);
  };

  const handleDelete = (item) => {
    console.log('Delete:', item);
  };

  const handleRowSelect = (selectedItems) => {
    setSelectedRows(selectedItems);
    console.log('Selected Rows:', selectedItems);
  };

  return (
    <div>
      <h1>Class List
      <CButton color="info" onClick={() => handleEdit(item)}>
        <CIcon icon={cilPencil} /> ADD
      </CButton>


      </h1>
      <CSmartTable
        columns={tableColumns}
        items={tableData}
        itemsPerPage={5}
        pagination
        // selectable
        onSelectedItemsChange={handleRowSelect}
        tableHeadProps={{ color: 'primary' }}
        tableProps={{ striped: true, hover: true }}
        scopedColumns={{
          actions: (item) => (
            <td>
              <CButtonGroup>
                <CButton color="info" onClick={() => handleEdit(item)}>
                  <CIcon icon={cilPencil} /> Edit
                </CButton>
                <div style={{ borderLeft: '1px solid #ccc', height: '24px', margin: '0 8px' }}></div>
                <CButton color="danger" onClick={() => handleDelete(item)}>
                  <CIcon icon={cilTrash} /> Delete
                </CButton>
              </CButtonGroup>
            </td>
          ),
        }}
      />
      {/* {selectedRows.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <strong>Selected Rows:</strong>
          <ul>
            {selectedRows.map((row) => (
              <li key={row.id}>{row.name} (ID: {row.id})</li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default Classes;