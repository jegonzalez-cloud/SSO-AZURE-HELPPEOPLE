import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import lock from "./utils/img/lock.svg";
import { useState, useEffect, useCallback } from "react";
import environment from "./Environment/environment.json";
import Swal from 'sweetalert2'

export default function App() {
  const [tenand_state, set_tenand_state] = useState("");
  const [client_state, set_client_state] = useState("");
  const [secret_state, set_secret_state] = useState("");
  const [dominio_state, set_dominio_state] = useState("");
  const [name, set_name_state] = useState("");

  useEffect(() => {
    getFullName();
    getData();
  }, [getFullName, getData]);

  const token = btoa(environment.apiToken);

  const getData = useCallback(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(
      "http://localhost/HelppeopleRestServiceGIT/api/services/GetAzureConfiguration?token=" +
        token,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        set_client_state(result.Values[0].CLIENT_ID);
        set_tenand_state(result.Values[0].TENANT_ID);
        set_secret_state(result.Values[0].SECRECT_ID);
        set_dominio_state(result.Values[0].DOMINIO);
      })
      .catch((error) => console.log("error", error));
  }, []);

  const getFullName = useCallback(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow"
    };

    fetch(
      "http://localhost/HelppeopleRestServiceGIT/api/security/GetFullnameFromToken?token=NzhlMGQwM2UtZDFmMy00ZjU3LTkxMTktZmJkY2EwOTUzODdm",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        set_name_state(result.Values);
      })
      .catch((error) => console.log("error", error));
  }, []);

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  const save_configuration = (e) => {
    e.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      CID: btoa(client_state),
      TID: btoa(tenand_state),
      SID: btoa(secret_state),
      DOM: btoa(dominio_state)
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(
      "http://localhost/HelppeopleRestServiceGIT/api/services/InsertConfAzure",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        Toast.fire({
          icon: 'success',
          title: 'Configuracion guardada exitosamente!'
        })
        getData();
      })
      .catch((error) => console.log("error", error));

    set_client_state("");
    set_tenand_state("");
    set_secret_state("");
    set_dominio_state("");
    e.target.reset();
  };

  return (
    <main>
      <div id="main__div">
        <h1 className="m-5">Bienvenido {name},</h1>
        <div className="card m-5">
          <div
            id="card_header_configuration"
            className="card-header fw-semibold"
          >
            Configuracion
          </div>

          <div className="card-body">
            <form onSubmit={(e) => save_configuration(e)}>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <img src={lock} alt="img" />
                </span>
                <input
                  onChange={(e) => set_client_state(e.target.value)}
                  type="text"
                  value={client_state}
                  className="form-control"
                  placeholder="Client Id"
                  aria-label="client"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <img src={lock} alt="img" />
                </span>
                <input
                  onChange={(e) => set_tenand_state(e.target.value)}
                  value={tenand_state}
                  type="text"
                  className="form-control"
                  placeholder="Tenand Id"
                  aria-label="tenand"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <img src={lock} alt="img" />
                </span>
                <input
                  onChange={(e) => set_secret_state(e.target.value)}
                  type="text"
                  value={secret_state}
                  className="form-control"
                  placeholder="Client Secret"
                  aria-label="secret"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <img src={lock} alt="img" />
                </span>
                <input
                  onChange={(e) => set_dominio_state(e.target.value)}
                  type="text"
                  value={dominio_state}
                  className="form-control"
                  placeholder="Dominio"
                  aria-label="dominio"
                  aria-describedby="basic-addon1"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  id="button__save"
                  className="btn btn-outline-dark"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
