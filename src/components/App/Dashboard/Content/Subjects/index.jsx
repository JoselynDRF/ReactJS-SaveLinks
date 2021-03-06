import React, { Component } from 'react';
import uuid from 'uuid'; // eslint-disable-line
import axios from 'axios';

import ResourcesSubject from './ResourcesSubject';
import InputSubject from './InputSubject';
import NavSubjects from './NavSubjects';
import BarSubjects from './BarSubjects';
import SearchResults from './SearchResults';
import { post, put } from './../../../HttpServices';

import imgDefault from './../../../../../assets/img/default.png';
import './../../../../../assets/img/react.png';
import './../../../../../assets/img/angular.png';
import './subjects.css';

class Subjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      textInputSubject: '',
      textInputLink: '',
      openSearchResults: false,
      openInputLink: false,
      openInputSubject: false,
      subjects: [{
        id: '',
        name: '',
        active: true,
        links: [],
      }],
    };

    this.handlechangeSubject = this.handlechangeSubject.bind(this);
    this.handleOpenInputSubject = this.handleOpenInputSubject.bind(this);
    this.handleOpenInputLink = this.handleOpenInputLink.bind(this);
    this.handleCloseInputSubject = this.handleCloseInputSubject.bind(this);
    this.handleCloseInputLink = this.handleCloseInputLink.bind(this);
    this.handleAddNewSubject = this.handleAddNewSubject.bind(this);
    this.handleAddNewLink = this.handleAddNewLink.bind(this);
    this.handleDeleteLink = this.handleDeleteLink.bind(this);
    this.handleFavorites = this.handleFavorites.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleCloseSearchResults = this.handleCloseSearchResults.bind(this);
    this.handleValueInputSubject = this.handleValueInputSubject.bind(this);

    this.handleValueInputLink = this.handleValueInputLink.bind(this);
  }

  // Get subjects from service
  componentDidMount() {
    axios.get('http://localhost:3000/db')
      .then((response) => {
        this.setState({
          subjects: response.data.subjects,
        });
      })
      .catch((error) => {
        console.log('GET error', error);
      });
  }

  // Get current subject resources
  getActiveSubjectResources() {
    return this.state.subjects.filter(subject => subject.active)[0];
  }

  // Update active subject
  updateActiveSubject(current) {
    return this.state.subjects.map((index) => {
      const subject = index;
      subject.active = (subject.id === current.id);
      return subject;
    });
  }

  // Create new subject
  createNewSubject(event) {
    const newSubject = {
      id: uuid.v4(),
      name: event.target.text.value,
      active: false,
      links: [],
    };

    const subjects = this.state.subjects.concat(newSubject);

    post(newSubject); // Update json server
    return subjects;
  }

  // Create new link
  createNewLink(event) {
    const newLink = {
      id: uuid.v4(),
      url: event.target.text.value,
      title: 'New link',
      picture: imgDefault,
      description: 'No content yet',
      observation: 'New link',
      autor: 'Username',
      date: Date.now(),
      isFavorite: false,
    };

    const currentSubject = this.getActiveSubjectResources();

    const subjects = this.state.subjects.map((index) => {
      const subject = index;
      if (subject.id === currentSubject.id) {
        subject.links = subject.links.concat(newLink);
      }

      put(subject.id, subject); // Update json server
      return subject;
    });

    return subjects;
  }

  // Delete link
  updateDeletedLink(id) {
    const currentSubject = this.getActiveSubjectResources();

    const subjects = this.state.subjects.map((subject) => {
      if (subject.id === currentSubject.id) {
        currentSubject.links.map((index) => {
          const link = index;
          if (link.id === id) {
            link.isDeleted = true;
          }
          return link;
        });
      }

      put(subject.id, subject); // Update json server
      return subject;
    });

    return subjects;
  }

  // Update links favorites
  updateFavorites(id) {
    const currentSubject = this.getActiveSubjectResources();

    const subjects = this.state.subjects.map((subject) => {
      if (subject.id === currentSubject.id) {
        currentSubject.links.map((index) => {
          const link = index;
          if (link.id === id) {
            link.isFavorite = !link.isFavorite;
          }
          return link;
        });
      }

      put(subject.id, subject); // Update json server
      return subject;
    });

    return subjects;
  }


  // ******************** UPDATE STATE ******************** //

  // Change active subject - Update subjects
  handlechangeSubject(event, current) {
    event.preventDefault();
    const subjects = this.updateActiveSubject(current);
    this.setState({
      subjects,
    });
  }

  // Open inputSubject
  handleOpenInputSubject() {
    this.setState({
      openInputSubject: true,
    });
  }

  // Open inputLink
  handleOpenInputLink() {
    this.setState({
      openInputLink: true,
    });
  }

  // Close inputSubject
  handleCloseInputSubject() {
    this.setState({
      openInputSubject: false,
    });
  }

  // Close inputLink
  handleCloseInputLink() {
    this.setState({
      openInputLink: false,
    });
  }

  // Add new subject (event from inputSubject) - Update subjects
  handleAddNewSubject(event) {
    event.preventDefault();
    const subjects = this.createNewSubject(event);
    this.setState({
      subjects,
      openInputSubject: false,
      textInputSubject: '',
    });
  }

  // Add new link (event from inputLink) - Update subjects
  handleAddNewLink(event) {
    event.preventDefault();
    const subjects = this.createNewLink(event);
    this.setState({
      subjects,
      openInputLink: false,
      textInputLink: '',
    });
  }

  // Delete link - Update subjects
  handleDeleteLink(id) {
    const subjects = this.updateDeletedLink(id);
    this.setState({
      subjects,
    });
  }

  // Change state favorite - Update subjects
  handleFavorites(id) {
    const subjects = this.updateFavorites(id);
    this.setState({
      subjects,
    });
  }

  // Open search results and update search value
  handleSearch(event) {
    this.setState({
      openSearchResults: true,
      searchText: event.target.value,
    });
  }

  // Close search results
  handleCloseSearchResults() {
    this.setState({
      openSearchResults: false,
    });
  }

  // Update value InputSubject
  handleValueInputSubject(event) {
    this.setState({
      textInputSubject: event.target.value,
    });
  }

  // Update value InputLink
  handleValueInputLink(event) {
    this.setState({
      textInputLink: event.target.value,
    });
  }


  // ******************** RENDER ******************** //

  // Render inputSubject
  renderInputSubject() { // eslint-disable-line
    if (this.state.openInputSubject) {
      return (
        <InputSubject
          textInputSubject={this.state.textInputSubject}
          handleCloseInputSubject={this.handleCloseInputSubject}
          handleAddNewSubject={this.handleAddNewSubject}
          handleValueInputSubject={this.handleValueInputSubject}
        />
      );
    }
  }

  // Render search results
  renderSearchResults() { // eslint-disable-line
    if (this.state.openSearchResults) {
      return (
        <SearchResults
          subjects={this.state.subjects}
          searchText={this.state.searchText}
          handleCloseSearchResults={this.handleCloseSearchResults}
        />
      );
    }
  }

  render() {
    return (
      <div>
        <BarSubjects
          handleOpenInputSubject={this.handleOpenInputSubject}
          handleSearch={this.handleSearch}
        />

        {this.renderInputSubject()}
        {this.renderSearchResults()}

        <NavSubjects
          subjects={this.state.subjects}
          handlechangeSubject={this.handlechangeSubject}
        />

        <ResourcesSubject
          activeSubject={this.getActiveSubjectResources()}
          textInputLink={this.state.textInputLink}
          openInputLink={this.state.openInputLink}
          handleOpenInputLink={this.handleOpenInputLink}
          handleCloseInputLink={this.handleCloseInputLink}
          handleAddNewLink={this.handleAddNewLink}
          handleFavorites={this.handleFavorites}
          handleDeleteLink={this.handleDeleteLink}
          handleValueInputLink={this.handleValueInputLink}
        />
      </div>
    );
  }
}

export default Subjects;
