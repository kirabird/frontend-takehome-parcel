import React, { Component } from 'react';
import {
  Button,
  Header,
  Container,
  Form,
  Divider,
  Grid,
  Item,
  Label,
  Segment,
  ItemContent,
} from 'semantic-ui-react';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: undefined,
      submittedInput: 'cucumbers',
      savedResults: {},
      results: [],
      localStorage: window.localStorage,
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.createItems = this.createItems.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave(e) {
    let name = e.name;
    window.localStorage.setItem(name, e);
    // let name = e.target.dataset.name;
    this.setState(prevState => {
      let localStorage = Object.assign({}, prevState.localStorage); // creating copy of state variable localStorage
      localStorage[name] = e; // update the name property, assign a new value
      return { localStorage }; // return new object localStorage object
    });
    // console.log('hihi', e.target.dataset.name);
  }

  // handleSearch(event) {
  //   event.preventDefault();
  //   fetch('http://localhost:3000/api/search', {
  //     method: 'get',
  //     // headers: { 'Content-Type': 'application/json' },
  //     // body: JSON.stringify({
  //     //   query: this.state.submittedInput,
  //     // }),
  //   });
  // }
  createSaved(stor) {
    // let objectKeys = Object.keys(stor);
    // console.log('objkeys', objectKeys);
    return (
      <Item key={stor.name}>
        <Item.Content>
          <Item.Header as="h4">{stor.name}</Item.Header>
          <Item.Meta>
            <a href={stor.homepage_uri}>{stor.homepage_uri}</a>|
            <a href={stor.gem_uri}>Gem Page</a>
          </Item.Meta>
          <Item.Description>{stor.info}</Item.Description>
          <Item.Extra>
            <Label>Downloads: {stor.downloads}</Label>
            <Button
              // onClick={this.handleSave}
              // onClick={() => this.handleSave(item)}
              color="red"
              floated="right"
            >
              Dummy Delete
            </Button>
          </Item.Extra>
        </Item.Content>
      </Item>
    );
  }

  createItems(item) {
    return (
      <Item key={item.name}>
        <Item.Content>
          <Item.Header as="h4">{item.name}</Item.Header>
          <Item.Meta>
            <a href={item.homepage_uri}>{item.homepage_uri}</a>|
            <a href={item.gem_uri}>Gem Page</a>
          </Item.Meta>
          <Item.Description>{item.info}</Item.Description>
          <Item.Extra>
            <Label>Downloads: {item.downloads}</Label>
            <Button
              data-name={item.name}
              // onClick={this.handleSave}
              onClick={() => this.handleSave(item)}
              color="teal"
              floated="right"
            >
              Save
            </Button>
          </Item.Extra>
        </Item.Content>
      </Item>
    );
  }

  handleSearch(event) {
    event.preventDefault();
    fetch(`http://localhost:3000/api/${this.state.input}`)
      .then(response => {
        if (response.status !== 200) {
          console.log(
            'Looks like there was a problem. Status Code: ' + response.status,
          );
          return;
        }
        response.json().then(results => {
          this.setState({ results: results });
          console.log(this.state.results);
        });
      })
      .catch(err => {
        console.log('Fetch Error :-S', err);
      });
  }

  render() {
    const items = this.state.results;
    const listComps = items.map(this.createItems);
    // const stor = window.localStorage;
    const stor = this.state.localStorage;
    const saved = Object.keys(stor).map(this.createSaved);
    console.log('stor', stor);
    // const saved = stor.map(this.createSaved);
    return (
      <div>
        <Container text>
          <Header as="h1" textAlign="center">
            Ruby Gems Detective
          </Header>
          <Form size="large">
            <Form.Field
              label="Find and save Ruby Gems:"
              control="input"
              placeholder="enter ruby gem"
              onChange={e => this.setState({ input: e.target.value })}
            />
            <Button onClick={this.handleSearch} type="submit">
              Search
            </Button>
            <Divider hidden />
          </Form>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <Segment>
                  <Label attached="top">Results</Label>
                  <Item.Group divided>{listComps}</Item.Group>
                </Segment>
              </Grid.Column>
              <Grid.Column width={8}>
                <Segment>
                  <Label attached="top">Saved Gems:</Label>
                  <Item.Group divided>{saved}</Item.Group>
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default App;
