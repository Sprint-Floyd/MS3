import React from "react";
import {UserAPI} from "../API/UserAPI";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle, MDBContainer,
  MDBTable, MDBTableBody,
  MDBTableHead
} from "mdb-react-ui-kit";
import { t } from "i18next";
import {panic} from "../components/common/Panic";

function defaultComparator(prop1, prop2){
  if (prop1 < prop2) return -1;
  if (prop1 > prop2) return 1;
  return 0;
}

export default class TenantUsersView extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      utenti: [],
      orderBy: "lastname",
      orderDirection: "asc",
      comparator: defaultComparator,
    }
    this.setOrderBy = this.setOrderBy.bind(this);
  }

  /**
   * Cambia la proprietà degli utenti per cui si vuole ordinare,
   * usando un comparatore di default
   */
  setOrderBy(userProp) {
    const { orderBy, orderDirection } = this.state;

    // Cambia direzione di ordinamento se la colonna è la stessa
    const newOrderDirection = orderBy === userProp
      ? (orderDirection === "asc" ? "desc" : "asc")
      : "asc";

    this.setState({
      orderBy: userProp,
      orderDirection: newOrderDirection, // Memorizza la direzione di ordinamento
      comparator: defaultComparator,
    });
  }
  /**
   * Cambia la proprietà degli utenti per cui si vuole ordinare,
   * specificando un comparatore custom
   */
  setOrderByAndComparator(userProp, comparator){
    this.setState({
      orderBy: userProp,
      comparator: comparator
    })
  }


  async componentDidMount() {
    try {

      let utenti = await(new UserAPI().getAllUsersInfo());

      this.setState({
        utenti : utenti,
      })
    } catch (err) {

      panic()
    }

  }

  getSortIcon(column) {
    let direction = "fas fa-sort"
    if (this.state.orderBy === column) direction = this.state.orderDirection === "asc" ? "fas fa-sort-up" : "fas fa-sort-down"

    return <i
      className={direction}
      style={{
        color: this.state.orderBy === column ? "#1a1a1a" : "#e0e0e0",
        marginLeft: "5px",
      }}
    ></i>;
  }


  render() {
    const sortedData = [...this.state.utenti].sort((u1, u2) => {
      let p1 = u1[this.state.orderBy];
      let p2 = u2[this.state.orderBy];

      // Determine sorting direction
      const direction = this.state.orderDirection === "asc" ? 1 : -1;

      // Use comparator and apply the direction
      return direction * this.state.comparator(p1, p2);
    });

    return(
      <MDBContainer fluid className="main-content-container px-4 pb-4 pt-4">
        <MDBCard alignment="center">
          <MDBCardBody className="text-center">
            <MDBCardTitle style={{ marginBottom: 10 }}>{t("User Information")}</MDBCardTitle>
            <MDBTable align="middle"
                      bordered
                      small
                      hover >
              <MDBTableHead color='tempting-azure-gradient' textwhite>
                <tr>
                  <th scope='col' onClick={() => this.setOrderBy("name")} >{t("Name")} {this.getSortIcon("name")}</th>
                  <th scope='col' onClick={() => this.setOrderBy("lastname")} >{t("Surname")} {this.getSortIcon("lastname")}</th>
                  <th scope='col' onClick={() => this.setOrderBy("birthday")} >{t("Birthdate")} {this.getSortIcon("birthday")}</th>
                  <th scope='col' onClick={() => this.setOrderBy("email")} >{"Email"} {this.getSortIcon("email")}</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {sortedData.map((data, key) => (
                  <tr key={key}>
                    <td>{data.name}</td>
                    <td>{data.lastname}</td>
                    <td>{data.birthday}</td>
                    <td>{data.email}</td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    );
  }
}