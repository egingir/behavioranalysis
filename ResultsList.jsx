import React, { useCallback} from 'react';
import {
  DataGrid,
  trTR,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import './List.css';
import { trTR as coretrTR } from '@mui/material/locale';
import { createTheme, ThemeProvider } from '@mui/material/styles';
//import { StoreContext } from '../../shared/context/store-context';

const ResultsList = (props) => {

  //const store = useContext(StoreContext);
 
  const theme = createTheme(
    {
      palette: {
        primary: { main: '#1976d2' },
      },
    },
    trTR,
    coretrTR,
    {
      GridCsvExportOptions: { fileName: 'gh' },
    }
  );
 
  const columns = [
    { field: 'katilimcino', headerName: 'Katılımcı No', width: 200 },
    { field: 'tip', headerName: 'Test', width: 200 },
    { field: 'date', headerName: 'Tarih', width: 200 },
    { field: 'testsirasi', headerName: 'Test Sırası', width: 100 },
    { field: 'yas', headerName: 'Yaş', width: 100 },
    { field: 'sinif', headerName: 'Sınıf', width: 100 },
    { field: 'cinsiyet', headerName: 'Cinsiyet', width: 100 },
    { field: 'aciklama', headerName: 'Açıklama', width: 600 }
  ];

  const OnSelectionChangeHandler = (event) => {
    props.onItemSelect(event[0]);
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport csvOptions={{ utf8WithBom: true }} />
      </GridToolbarContainer>
    );
  }

  return (
    <div className="itemListContainer">
      <ThemeProvider theme={theme}>
        <DataGrid key={props.items}
        density="compact"
          components={{
            Toolbar: CustomToolbar,
          }}
          rows={props.items}
          columns={columns}
          pageSize={100}
          getRowId={(r) => r.id}
          onSelectionModelChange={OnSelectionChangeHandler}
        />
      </ThemeProvider>
    </div>
  );
};

export default ResultsList;
