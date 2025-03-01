package org.cswteams.ms3.rest;

import org.cswteams.ms3.control.scambioTurno.IControllerScambioTurno;
import org.cswteams.ms3.dto.RequestTurnChangeDto;
import org.cswteams.ms3.dto.ViewUserTurnRequestsDTO;
import org.cswteams.ms3.exception.ConcreteShiftException;
import org.cswteams.ms3.dto.AnswerTurnChangeRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/change-shift-request/")
public class ShiftChangeRequestRestEndpoint {

    @Autowired
    private IControllerScambioTurno controllerScambioTurno;

    /**
     * Permette la modifica di un assegnazione turno già esistente.
     * @param requestTurnChangeDto
     */
    @PreAuthorize("hasAnyRole('DOCTOR')")
    @RequestMapping(method = RequestMethod.PUT)
    public ResponseEntity<?> requestShiftChange(@RequestBody RequestTurnChangeDto requestTurnChangeDto)  {
        try {
            controllerScambioTurno.requestShiftChange(requestTurnChangeDto);
        } catch (ConcreteShiftException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>("SUCCESS", HttpStatus.ACCEPTED);
    }

    /**
     * Ritorna le richieste iniziate dall'id indicato
     * @param idUtente
     */
    @PreAuthorize("hasAnyRole('DOCTOR')")
    @RequestMapping(method = RequestMethod.GET, path = "/by/user_id={idUtente}")
    public ResponseEntity<?> getRequestsBySender(@PathVariable Long idUtente)  {

        if (idUtente != null) {
            List<ViewUserTurnRequestsDTO> requests = controllerScambioTurno.getRequestsBySender(idUtente);
            if (requests == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>( requests, HttpStatus.FOUND);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PreAuthorize("hasAnyRole('DOCTOR')")
    @RequestMapping(method = RequestMethod.GET, path = "/to/user_id={idUtente}")
    public ResponseEntity<?> getRequestsToSender(@PathVariable Long idUtente)  {

        if (idUtente != null) {
            List<ViewUserTurnRequestsDTO> requests = controllerScambioTurno.getRequestsToSender(idUtente);
            if (requests == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>( requests, HttpStatus.FOUND);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PreAuthorize("hasAnyRole('DOCTOR')")
    @RequestMapping(method = RequestMethod.PUT, path = "/answer")
    public ResponseEntity<?> answerRequest(@RequestBody AnswerTurnChangeRequestDTO answerTurnChangeRequestDTO)  {
        try{
            controllerScambioTurno.answerTurnChangeRequest(answerTurnChangeRequestDTO);
            return new ResponseEntity<>(HttpStatus.OK);

        } catch(Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
