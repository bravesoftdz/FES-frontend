import React, {Component} from "react";
import {Button, FormGroup, FormControl, ControlLabel, Form} from "react-bootstrap";
import "../../styles/user/Register.css";
import countryList from 'react-select-country-list'
import Select from 'react-select'
import axios from 'axios'
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.options = countryList().getData()

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            dateOfBirth: "",
            city: "",
            password: "",
            confirmedPassword: "",
            warning: "",
            startDate: moment(),
            options: this.options,
            country: null,
            disabledWarning: {display: "none"},
            isMounted: false
        };

        this.validateForm = this.validateForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validatePasswordsEquality = this.validatePasswordsEquality.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.validateDate = this.validateDate.bind(this);
        this.handleChangeCountry = this.handleChangeCountry.bind(this);
        this.isAdult = this.isAdult.bind(this);
        this.validate = this.validate.bind(this);
        this.displayErrorMessage = this.displayErrorMessage.bind(this);
    }


    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleChangeDate(date) {
        this.setState({
            startDate: date,
            dateOfBirth: moment(date).format('DD-MM-YYYY')
        });
    }

    componentDidMount() {
        this.setState({
            isMounted: true
        });
    }

    handleChangeCountry(country) {
        if (this.state.isMounted) {
            this.setState({
                country: country.label
            });
        }
    }

    handleSubmit = event => {
        //  if (this.validateForm())
        this.postRequest();
        event.preventDefault();
    };

    validateForm() {
        return this.validateDate() && this.validatePasswordsEquality() && this.validatePasswordStrength();

    }

    validatePasswordsEquality() {
        if (this.state.password === this.state.confirmedPassword) {
            return true;
        } else {
            this.setState({
                warning: "Hasła są różne",
                disabledWarning: {display: "block"}
            });
            return false;
        }
    }

    validatePasswordStrength() {
        if (this.state.password.match("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$")) {
            return true;
        } else {
            this.setState({
                warning: "Twoje hasło powinno zawierać co najmniej jedną większą literę, jedną mniejszą literę, cyfrę oraz posiadać 8 znaków",
                disabledWarning: {display: "block"}
            });
        }
    }

    validateDate() {
        return this.validateFormat() && this.isAdult();
    }

    validateFormat() {
        const selectedDate = this.state.dateOfBirth;
        const message = "Date format incorrect";
        return this.validate(selectedDate && moment(selectedDate, 'DD-MM-YYYY', true).isValid(), message)
    }

    isAdult() {
        const day = this.state.startDate.day();
        const month = this.state.startDate.month();
        const year = this.state.startDate.year();
        return this.validate(new Date(year + 18, month - 1, day) <= new Date(), "Nie jesteś pełnoletni");
    }

    validate(condition, message) {
        if (condition) {
            return true;
        } else {
            this.setState({
                warning: message,
                disabledWarning: {display: "block"}
            });
            return false;
        }
    }

    postRequest() {
        const user = {
            id: '',
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            dateOfBirth: this.state.dateOfBirth,
            city: this.state.city,
            country: this.state.country,
            password: this.state.password,
            confirmedPassword: this.state.confirmedPassword
        };

        axios({
            method: 'post',
            url: 'http://localhost:8080/register',
            data: user,
            config: {headers: {'Content-Type': 'application/json'}}
        })
            .then((response) => {
                window.location = './register/message'
            })
            .catch(error => {
                this.displayErrorMessage(error.response)
            });

    }

    displayErrorMessage(response) {
        this.setState({
            warning: response.data.message,
            disabledWarning: {display: "block"}
        });
    }

    render() {
        return (<div className="registerForm">
                <Form inline onSubmit={this.handleSubmit}>
                    <div className="groupPair">
                        <FormGroup controlId="firstName" bsSize="large">
                            <ControlLabel>Imię</ControlLabel>
                            <FormControl
                                autoFocus
                                type="text"
                                value={this.state.firstName}
                                onChange={this.handleChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup controlId="lastName" bsSize="large">
                            <ControlLabel>Nazwisko</ControlLabel>
                            <FormControl
                                autoFocus
                                type="text"
                                value={this.state.lastName}
                                onChange={this.handleChange}
                                required
                            />
                        </FormGroup>
                    </div>
                    <div className="groupPair">
                        <FormGroup controlId="email" bsSize="large">
                            <ControlLabel>Email</ControlLabel>
                            <FormControl
                                autoFocus
                                type="email"
                                value={this.state.email}
                                onChange={this.handleChange}
                                required
                            />
                        </FormGroup>
                        <FormGroup controlId="dateOfBirth" bsSize="large">
                            <ControlLabel>Data urodzenia</ControlLabel>
                            <DatePicker
                                selected={this.state.startDate}
                                onChange={this.handleChangeDate}
                                required
                            />
                        </FormGroup>
                    </div>
                    <div className="groupPair">
                        <FormGroup controlId="city" bsSize="large">
                            <ControlLabel>Miasto</ControlLabel>
                            <FormControl
                                autoFocus
                                type="text"
                                value={this.state.city}
                                onChange={this.handleChange}
                                required
                            />
                        </FormGroup>

                        <FormGroup controlId="Country" bsSize="large">
                            <ControlLabel>Kraj</ControlLabel>
                            <Select required="required"
                                    options={this.state.options}
                                    value={this.state.value}
                                    onChange={this.handleChangeCountry}

                            />
                        </FormGroup>

                    </div>
                    <div className="groupPair">
                        <FormGroup controlId="password" bsSize="large">
                            <ControlLabel>Hasło</ControlLabel>
                            <FormControl
                                value={this.state.password}
                                onChange={this.handleChange}
                                type="password"
                                required
                            />
                        </FormGroup>
                        <FormGroup controlId="confirmedPassword" bsSize="large">
                            <ControlLabel>Powtórz hasło</ControlLabel>
                            <FormControl
                                value={this.state.confirmedPassword}
                                onChange={this.handleChange}
                                type="password"
                                required
                            />
                        </FormGroup>
                    </div>
                    <Button
                        block
                        bsSize="large"
                        bsStyle="warning"
                        type="submit"
                    >
                        Zarejestruj się
                    </Button>

                </Form>
                <div className="space"></div>
                <div className="warning" style={this.state.disabledWarning}>
                    {this.state.warning}
                </div>
            </div>
        );
    }
}