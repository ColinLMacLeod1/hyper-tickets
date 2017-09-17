package main

import (
	"bytes"
    "encoding/json"
    "fmt"
    "strconv"

    "github.com/hyperledger/fabric/core/chaincode/shim"
    sc "github.com/hyperledger/fabric/protos/peer"
)

type SmartContract struct {
}

type Ticket struct {
    OwnerId string `json:"ownerId"`
}

func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
    return shim.Success(nil)
}

func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
    function, args := APIstub.GetFunctionAndParameters()
    fmt.Printf("%s", function)
    if function == "initLedger" {
        return s.initLedger(APIstub)
    } else if function == "createTicket" {
        return s.createTicket(APIstub, args)
    } else if function == "queryAllTickets" {
        return s.queryAllTickets(APIstub)
    } else if function == "changeTicketOwner" {
        return s.changeTicketOwner(APIstub, args)
    } else if function == "getTicketHistory" {
        return s.getTicketHistory(APIstub, args)
    }

    return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
    tickets := []Ticket{
        Ticket{OwnerId: "2"},
    }

    i := 0
    for i < len(tickets) {
        fmt.Println("i is ", i)
        ticketAsBytes, _ := json.Marshal(tickets[i])
        APIstub.PutState(strconv.Itoa(i), ticketAsBytes)
        fmt.Println("Added", tickets[i])
        i = i + 1
    }

    return shim.Success(nil)
}

func (s *SmartContract) createTicket(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
    if len(args) != 2 {
        return shim.Error("Incorrect number of arguments. Expecting 2.")
    }

    var ticket = Ticket{OwnerId: args[1]}

    ticketAsBytes, _ := json.Marshal(ticket)
    APIstub.PutState(args[0], ticketAsBytes)

    return shim.Success(nil)
}

func (s *SmartContract) queryAllTickets(APIstub shim.ChaincodeStubInterface) sc.Response {
    startKey := ""
    endKey := ""

    resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
    if err != nil {
        return shim.Error(err.Error())
    }
    defer resultsIterator.Close()

    var buffer bytes.Buffer
    buffer.WriteString("[")

    isFirstElement := false
    for resultsIterator.HasNext() {
        queryResponse, err := resultsIterator.Next()
        if err != nil {
            return shim.Error(err.Error())
        }
        if isFirstElement == true {
            buffer.WriteString(",")
        }
        buffer.WriteString("{\"key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"value\":")
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		isFirstElement = true
    }

	buffer.WriteString("]")

	fmt.Printf("- queryAllTickets:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) changeTicketOwner(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
    if len(args) != 2 {
        return shim.Error("Incorrect number of arguments. Expecting 2.")
    }

    ticketAsBytes, _ := APIstub.GetState(args[0])
    ticket := Ticket{}

    json.Unmarshal(ticketAsBytes, &ticket)
    ticket.OwnerId = args[1]

    ticketAsBytes, _ = json.Marshal(ticket)
    APIstub.PutState(args[0], ticketAsBytes)

    return shim.Success(nil)
}

func (s *SmartContract) getTicketHistory(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
    if len(args) != 1 {
        return shim.Error("Incorrect number of arguments. Expecting 1.")
    }

    resultsIterator, err := APIstub.GetHistoryForKey(args[0])
    if err != nil {
        return shim.Error(err.Error())
    }
    defer resultsIterator.Close()

    var buffer bytes.Buffer
        buffer.WriteString("[")

        isFirstElement := false
        for resultsIterator.HasNext() {
            queryResponse, err := resultsIterator.Next()
            if err != nil {
                return shim.Error(err.Error())
            }
            if isFirstElement == true {
                buffer.WriteString(",")
            }
            buffer.WriteString("{\"txId\":")
    		buffer.WriteString("\"")
    		buffer.WriteString(queryResponse.TxId)
    		buffer.WriteString("\",")


            buffer.WriteString("\"timestamp\":")
    		buffer.WriteString("\"")
    		buffer.WriteString(queryResponse.GetTimestamp().String())
    		buffer.WriteString("\",")


            buffer.WriteString("\"isDelete\":")
    		buffer.WriteString(strconv.FormatBool(queryResponse.IsDelete))

    		buffer.WriteString(", \"value\":")
    		buffer.WriteString(string(queryResponse.Value))
    		buffer.WriteString("}")
    		isFirstElement = true
        }

    	buffer.WriteString("]")

    	fmt.Printf("- queryAllTickets:\n%s\n", buffer.String())

    	return shim.Success(buffer.Bytes())
}

func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
