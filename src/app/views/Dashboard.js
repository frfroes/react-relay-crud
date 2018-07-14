import React, { Component } from 'react';

import { Grid, Segment, Header, Icon, Container  } from 'semantic-ui-react'

export class Dashboard extends Component {
  
  render() {
    
    const { header, data, form } = this.props;

    return (
      <Container>
        <Header as='h2'>
          <Icon name={header.icon} />
          <Header.Content>{header.label}</Header.Content>
        </Header>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Segment>
                {data.isReady && data.component}
              </Segment>
            </Grid.Column>
            <Grid.Column width={8}>
                {form.component}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
