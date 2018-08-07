import React, { Component } from 'react';

import Amplify, { API, graphqlOperation }  from "aws-amplify";
import { Connect, withAuthenticator } from 'aws-amplify-react'; 

import aws_exports from './aws-exports';



Amplify.configure(aws_exports);

class EventForm extends Component {
  createEvent = async (e) => {
    e.preventDefault();

    const CreateEvent = `mutation CreateEvent($name: String!, $when: String!, $where: String!, $description: String!) {
      createEvent(name: $name, when: $when, where: $where, description: $description) {
        id
        name
        where
        when
        description
      }
    }`;
    
    // Mutation
    const eventDetails = {
        name: 'Party tonight!',
        when: '8:00pm',
        where: 'Ballroom',
        description: 'Coming together as a team!'
    };
    
    const newEvent = await API.graphql(graphqlOperation(CreateEvent, eventDetails));
    console.log(newEvent);
  }

  render() {
    return (
      <div>
        <button onClick={this.createEvent}>Create Event</button>
      </div>
    )
  }
}

class App extends Component {
  render() {
    const ListView = ({ events }) => (
      <div>
          <h3>All events</h3>
          <ul>
              {events.map(event => <li key={event.id}>{event.name} ({event.id})</li>)}
          </ul>
      </div>
  );

  const ListEvents = `query ListEvents {
      listEvents {
          items {
            id
            name
          }
      }
  }`;

  return (
      <div>
        <EventForm />

        <Connect query={graphqlOperation(ListEvents)}>
            {
              ({ data, loading, errors }) => {
                if (loading) return <div>Loading...</div>;
                if (errors.length > 0) return <div>{JSON.stringify(errors)}</div>;
                if (!data.listEvents) return;
                return <ListView events={data.listEvents.items} />;
              }
            }
        </Connect>
      </div>
  )
  }
}

export default withAuthenticator(App);

