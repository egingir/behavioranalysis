import React, {useState, useEffect, useContext, useCallback, useRef } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [schoolType, setSchoolType] = useState();


let studentsLinkHeader = '...';

if(auth.schoolType === '1')
{
  studentsLinkHeader = 'Öğrenciler'
}
else if(auth.schoolType === '2')
{
  studentsLinkHeader = 'Personel Ev Adresleri'
}

  return (
    <ul className="nav-links">
 
     {/* {auth.isLoggedIn && (
        <li>
          <NavLink to="/personels" exact>
            Transferler
          </NavLink>
        </li>
      )}  */}
{/*
   {auth.isLoggedIn && (
        <li>
          <NavLink to="/plocations" exact>
            Tanımlı Duraklar
          </NavLink>
        </li>
      )} */}

    

      {/* {auth.isLoggedIn && (
        <li>
          <NavLink to="/management" exact>
            Yönetim
          </NavLink>
        </li>
      )} */}


      {auth.isLoggedIn && (
        <li>
          <NavLink to="/register" exact>
            Kayıt
          </NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <NavLink to="/task1" exact>
            Görev - 1
          </NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <NavLink to="/task2" exact>
            Görev - 2
          </NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <NavLink to="/task3" exact>
            Görev - 3
          </NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <NavLink to="/results" exact>
            İşlemler
          </NavLink>
        </li>
      )}

{auth.isLoggedIn && (
        <li>
          <NavLink to="/summary-shape" exact>
            Yap/Yapma (Özet)
          </NavLink>
        </li>
      )}

{auth.isLoggedIn && (
        <li>
          <NavLink to="/summary-nback" exact>
            Harf N (Özet)
          </NavLink>
        </li>
      )}

{auth.isLoggedIn && (
        <li>
          <NavLink to="/summary" exact>
            Görsel Nokta (Özet)
          </NavLink>
        </li>
      )}

{auth.isLoggedIn && (
        <li>
          <NavLink to="/summary-shape-raw" exact>
          Yap/Yapma (Data)
          </NavLink>
        </li>
      )}



{auth.isLoggedIn && (
        <li>
          <NavLink to="/summary-nback-raw" exact>
            Harf N (Data)
          </NavLink>
        </li>
      )}




{auth.isLoggedIn && (
        <li>
          <NavLink to="/summary-raw" exact>
            Görsel Nokta (Data)
          </NavLink>
        </li>
      )}

      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Giriş</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>Çıkış</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
