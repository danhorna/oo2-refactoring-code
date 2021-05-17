import React from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import { generateComponent, generateArray } from "../js/helpers";
import { CodeBlock, dracula } from "react-code-blocks";
import PropTypes from 'prop-types';

class FormRefactorings extends React.Component {
    constructor(props){
        super(props)
        this.state={
            counter:this.props.counter
        }
    }
    counterMore(){
        this.setState({
            counter: this.state.counter + 1
        })
    }
    render() { 
        //const {counterMore}=this.props;
        return ( 
                this.props.formElementRefactoring.map((refactoring) => {   
                this.counterMore.bind(this) 
                let text = generateComponent(refactoring.imports, refactoring.mounts, refactoring.functions, refactoring.stringFormElement);
                console.log(refactoring.stringFormElement);
                let nameForm;
                try{
                    let h=refactoring.stringFormElement.split('name="');
                    let t=h[1] ;
                    let name=t.split(`"`);    
                    nameForm=name[0];
                    
                }catch{
                    nameForm="Form"
                }      
                return (
                    
                    <React.Fragment>
                     
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey={this.props.counter.toString()}>
                                    {nameForm}
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey={this.props.counter.toString()}>
                                <Card.Body>
                                    <CodeBlock
                                        text={text}
                                        language="jsx"
                                        theme={dracula}
                                    />
                                </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        <hr className="m-0"></hr>
                    </React.Fragment>
                )
            })

         );
    }
}

 
export default FormRefactorings;