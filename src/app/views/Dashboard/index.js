import React, { Component } from 'react';
import { Segment, Header, Icon, Container, Button, Menu, Dropdown, Input } from 'semantic-ui-react'
import { ToastContainer } from 'react-toastify';

import { PlaceholderList } from '../../components';

import './index.css'

export class Dashboard extends Component {
  
  _handleActiveFilterChange = (e , { value }) => {
    const active = value !== 0 ? value : undefined;
    this.props.onChangeFilter({ active })
  }

  _handleEmailorNameFilterChange = (e , { value }) => {
    if(value && value.length >= 3){
      this.props.onChangeFilter({ OR: [
       { email_contains: value },
       { name_contains: value }
      ]})
    }else if(this.props.filter.OR){
      this.props.onChangeFilter({ OR: undefined })
    }
  }

  render() {
    
    const { header, data, form, filter } = this.props;
    const arrowPosition = form.isVisibleMobile ? 'left' : 'right';

    const activeFilter = filter.active === undefined ? 0 : filter.active;

    return (
      <Container className="dashboard">
        <Header as="h2">
          <Icon name={header.icon} />
          <Header.Content>{header.label}</Header.Content>
          <Button 
            primary 
            basic 
            size="small" 
            content={form.isVisibleMobile? `${header.label} list` : `${form.action} ${header.label}`}
            icon={`${arrowPosition} arrow`} labelPosition={arrowPosition}
            onClick={this.props.form.onToogleVisibleMobile}
          />
        </Header>
        <div className="content">
          <div className={form.isVisibleMobile? 'hidden-mobile' : ''}>
            <Menu attached="top">
              <Dropdown  
                item
                value={activeFilter}
                options={[
                  { text: 'All', value: 0 },
                  { text: 'Only active', value: true },
                  { text: 'Only unactive', value: false }
                ]}
                onChange={this._handleActiveFilterChange}
              />
              <Menu.Menu position='right'>
                <Menu.Item>
                  <Input 
                    icon='search' 
                    placeholder='Filter by name or email' 
                    onChange={this._handleEmailorNameFilterChange}
                  />
                </Menu.Item>
              </Menu.Menu>
            </Menu>
            <Segment>
              {data.isReady? data.component : <PlaceholderList length={6}/>}
            </Segment>
          </div>
          <div className={!form.isVisibleMobile? 'hidden-mobile' : ''} >
              {form.component}
          </div>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
      </Container>
    );
  }
}
