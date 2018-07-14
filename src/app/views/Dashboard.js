import React, { Component } from 'react';

import { Grid, Segment, Header, Icon, Container  } from 'semantic-ui-react'

export class Dashboard extends Component {
  
  render() {
    
    const { header, dataComponent, formComponent } = this.props;

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
                {dataComponent}
              </Segment>
            </Grid.Column>
            <Grid.Column width={8}>
                {formComponent}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
