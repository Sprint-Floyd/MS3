import React, {useState} from "react"
import {RichiestaRimozioneDaTurnoAPI} from "../../API/RichiestaRimozioneDaTurnoAPI";
//import RequestsTable from "../../components/common/TabellaRichiesteRitiro"
import {TurnoAPI} from "../../API/TurnoAPI";
import {AssegnazioneTurnoAPI} from "../../API/AssegnazioneTurnoAPI";
import {UserAPI} from "../../API/UserAPI";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import FilesUpload from "../../components/common/FilesUpload";
import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TemporaryDrawerRetirement
  from "../../components/common/BottomViewGestisciRitiro";


const ModalLinkFile = ({request, updateRequest}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button onClick={handleOpen}>
        Allega file
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Allega file</DialogTitle>
        <DialogContent>
          <FilesUpload type={"retirement"} idRequest={request.idRichiestaRimozioneDaTurno} request={request} updateRequest={updateRequest} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Chiudi
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const getSostituto = (users, request) => {
  if (request.idUtenteSostituto === null)
    return null;
  let u = users.find(user => user.id === request.idUtenteSostituto);
  console.log("Tutti gli utenti:", users);
  console.log("Sostituto:", u);
  return u.text;
}

export default class RichiesteRitiroView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      shifts: [],
      requests: [],         // list of all retirement requests
      userRequests: [],     // list of all user's retirement requests
      isLocal: false,       // if true, only user's retirement requests should be showed, oth. all users' requests
    };
  }

  async componentDidMount() {

    console.log("mounting component")

    let apiUser = new UserAPI();
    let apiRetirement = new RichiestaRimozioneDaTurnoAPI();
    let apiShifts = new AssegnazioneTurnoAPI();

    const users = await apiUser.getAllUser();
    this.setState({users: users});
    const shifts = await apiShifts.getGlobalShift();
    this.setState({shifts: shifts})
    const searchParams = new URLSearchParams(this.props.location.search);
    const local = searchParams.get('locale');
    if (local === "true") {
      this.setState({isLocal: true});
      let requestsForUser = await apiRetirement.getAllRequestsForUser(localStorage.getItem("id"));
      this.setState({userRequests: requestsForUser});
    } else {
      let allRequests = await apiRetirement.getAllRequests();
      this.setState({requests: allRequests});
    }

  }

  updateRequest = (updatedRequest) => {
    console.log("Updating request. New allegato:", updatedRequest.allegato);
    console.log(this.state.requests);
    const newRequests = this.state.requests.filter(request => request.idRichiestaRimozioneDaTurno !== updatedRequest.idRichiestaRimozioneDaTurno);
    newRequests.push(updatedRequest);
    this.setState({requests: newRequests});
  };

  render(view) {
    if (this.state.isLocal) {
      console.log("Richieste di ritiro:", this.state.userRequests);
      return (
        <React.Fragment>
          <Box mt={2} ml={2} mr={2} mb={2}>
            <TableContainer component={Paper}>
              <Table>
                <caption> Richieste di ritiro da turni </caption>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Richiedente</TableCell>
                    <TableCell>Giustificazione</TableCell>
                    <TableCell>Stato</TableCell>
                    <TableCell>Esito</TableCell>
                    <TableCell>Allegato</TableCell>
                    <TableCell>Sostituto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.userRequests.map((request) => (
                    <TableRow key={request.idRichiestaRimozioneDaTurno}>
                      <TableCell>{request.idRichiestaRimozioneDaTurno}</TableCell>
                      <TableCell>{this.state.users.find(user => user.id === request.idUtenteRichiedente).text}</TableCell>
                      <TableCell>{request.descrizione}</TableCell>
                      <TableCell>{request.esaminata ? 'Esaminata' : 'In attesa'}</TableCell>
                      <TableCell>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: request.esaminata ?
                              request.esito ?
                                'green'
                                : 'red'
                              : 'lightgray',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {request.allegato === null ?
                          <ModalLinkFile request={request} updateRequest={this.updateRequest}/>
                          : "Allegato presente"}
                      </TableCell>
                      <TableCell>{getSostituto(this.state.users, request)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <Box mt={2} ml={2} mr={2} mb={2}>
            <TableContainer component={Paper}>
              <Table>
                <caption> Richieste di ritiro da turni </caption>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Richiedente</TableCell>
                    <TableCell>Giustificazione</TableCell>
                    <TableCell>Stato</TableCell>
                    <TableCell>Esito</TableCell>
                    <TableCell>Processamento</TableCell>
                    <TableCell>Sostituto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.requests.map((request) => (
                    <TableRow key={request.idRichiestaRimozioneDaTurno}>
                      <TableCell>{request.idRichiestaRimozioneDaTurno}</TableCell>
                      <TableCell>{this.state.users.find(user => user.id === request.idUtenteRichiedente).text}</TableCell>
                      <TableCell>{request.descrizione}</TableCell>
                      <TableCell>{request.esaminata ? 'Esaminata' : 'In attesa'}</TableCell>
                      <TableCell>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: request.esaminata ?
                              request.esito ?
                                'green'
                                : 'red'
                              : 'lightgray',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {request.esaminata ?
                          "Richiesta processata"
                          : <TemporaryDrawerRetirement request={request} shifts={this.state.shifts} users={this.state.users} updateRequest={this.updateRequest}/>
                        }
                      </TableCell>
                      <TableCell>{
                        getSostituto(this.state.users, request)
                      }</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </React.Fragment>
      )
    }
  }
}
