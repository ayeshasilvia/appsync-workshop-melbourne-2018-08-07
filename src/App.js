import React, { Component } from 'react';

import Amplify, { graphqlOperation }  from "aws-amplify";
import { Connect, withAuthenticator } from 'aws-amplify-react'; 

import aws_exports from './aws-exports';



Amplify.configure(aws_exports);

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
      <Connect query={graphqlOperation(ListEvents)}>
          {({ data, loading, errors }) => {
            if (loading) return <div>Loading...</div>;
            if (errors.length > 0) return <div>{JSON.stringify(errors)}</div>;
            if (!data.listEvents) return;
            return <ListView events={data.listEvents.items} />;
          }}
      </Connect>
  )
  }
}

export default withAuthenticator(App);

