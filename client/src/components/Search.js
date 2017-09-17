import React from 'react';
import axios from 'axios';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';



export default class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        search: "",
        results: {data:[]}
      }
    }
  handleChange = (event) => {
     this.setState({
       search: event.target.value,
     });
   };

   search = (term) => {
     axios.post('https://hyper-tickets.appspot.com/api/search',{
       search:term
     }).then((results)=>{
       console.log(results)
       this.setState({
         results:results
       })
     }).catch((err)=>{
       console.log(err)
     })
   }
   buy = (id) => {
     axios.post('https://hyper-tickets.appspot.com/api/buy',{
       ownerId:"colin",
       id:id
     }).then(()=>{
       console.log("Bought")
     }).catch((err)=>{
       console.log(err)
     })
   }

  render() {
    return (
      <div className="searchContainer">
        <TextField
          hintText="Search"
          fullWidth={true}
          value={this.state.search}
          onChange={this.handleChange}
          onKeyPress={(e) => {
                if(e.key==='Enter'){
                  this.search(this.state.search);
                }
            }}
        />
        {this.state.results.data.map((ticket,index)=>
          <Card key={index} className="ticket">
						<CardHeader
							title={ticket.ownerId}
							subtitle={ticket.location}
						/>
						<CardTitle
							title={ticket.title}
							subtitle={ticket.type+' for $'+ticket.price.toString()+' in seat '+ticket.seat}
						/>
            <CardActions>
              <RaisedButton label="Buy" primary={true} onClick={()=>{this.buy(ticket.id)}}/>
            </CardActions>

					</Card>
        )}
      </div>
    )
  }
}
