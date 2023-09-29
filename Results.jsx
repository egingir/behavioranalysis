import React, { useCallback, useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';

import ResultsList from './ResultsList';
import ResultItem from './ResultItem';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { StoreContext } from '../../shared/context/store-context';
import './Admin.css';

const Results = () => {
  const store = useContext(StoreContext);
  const { isLoading, error, clearError } = useHttpClient();
  const [selectedItemId, setSelectedItemId] = useState();
  const [selectedItemShow, setSelectedItemShow] = useState(false);

const pageItems = store.behaviortests;
const ItemTypeTR = 'Sonuçlar';

  const ItemSelectHandler = useCallback((itemid) => {
    setSelectedItemShow(true);
    setSelectedItemId(itemid);
  }, []);

  const ItemUpdateHandler = useCallback((itemid) => {
    setSelectedItemId(itemid);
  }, []);

  if(!store.behaviors1)
  {
    return (
      <div className="center">
       <LoadingSpinner />
      </div>
    )
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
    
      <div className="adminpageContainer">
        {!isLoading && pageItems && (
          <div className="adminListContainer">
            <ResultsList items={pageItems} onItemSelect={ItemSelectHandler} />
          </div>
        )}
        {selectedItemId &&  selectedItemShow && (
          <div className="adminUpdateContainer">
            <ResultItem
              itemid={selectedItemId}
              onItemUpdate={ItemUpdateHandler}
              onClose={ () => setSelectedItemShow(false) }
            ></ResultItem>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Results;
