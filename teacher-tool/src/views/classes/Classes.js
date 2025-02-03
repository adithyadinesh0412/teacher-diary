import React, { useState , useEffect } from 'react';
import { CSmartTable } from '@coreui/react-pro';
import { CButton, CButtonGroup, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CForm, CFormInput, CFormSelect } from '@coreui/react';
import { cilPencil, cilTrash , cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import apiService from '../../services/apiService'


const Classes = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [classData, setClassData] = useState([]);
  const [classColumnData, setclassColumnData] = useState([]);
  const [formData, setFormData] = useState({ id: undefined , name: '' });
  const [fetchTrigger, setFetchTrigger] = useState(true);

  useEffect(() => {
    const fetchClassList = async () => {
      try {
        const data = await apiService.getClassList();
        
        const classList = data.result.data
        // Generate tableColumns dynamically
        const tableColumns = Object.keys(classList[0]).map((key) => ({
          key,
          label: key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) // Format label
        }));

        // Add actions column
        tableColumns.push({ key: 'actions', label: 'Actions' });
        
        // Generate tableData dynamically
        const tableData = classList.map(item => ({ ...item }));
        setclassColumnData(tableColumns)
        setClassData(tableData)
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    if (fetchTrigger) {
      fetchClassList()
      setFetchTrigger(false)
    };
  }, [fetchTrigger]);

  const handleEdit = async (item) => {
    await setFormData({
      id : item.id,
      name : item.name
    })
    console.log("FORM DATA : : : :  ",formData)
    setModalVisible(true);
  };
  const handleModalClose = (item) => {
    setFormData({
      name : ''
    })
    setModalVisible(false);
  };

  const handleDelete = (item) => {
    console.log('Delete:', item);
  };

  const handleAdd = () => {
    setModalVisible(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async () => {
    if(formData?.id == undefined){
      await apiService.createClass(formData)
    }else{
      await apiService.updateClass(formData)
    }

    setFetchTrigger(true)
    setModalVisible(false);
  };

  return (
    <div>
      <h1>Class List {' '}
        <CButton color="success" onClick={handleAdd}>
          <CIcon icon={cilPlus} /> ADD
        </CButton>
      </h1>
      <CSmartTable
        columns={classColumnData}
        items={classData}
        itemsPerPage={5}
        pagination
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

      {/* Modal for Adding a New Entry */}
      <CModal visible={modalVisible} onClose={() => handleModalClose()}>
        <CModalHeader>
          <CModalTitle>Add New Entry</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Enter Name"
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() =>  handleModalClose()}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={() => { 

            handleFormSubmit()
            }}>
            Submit
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Classes;
