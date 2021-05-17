import React from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import { generateComponent, generateArray } from "../js/helpers";
import { CodeBlock, dracula } from "react-code-blocks";
import PropTypes from 'prop-types';  
class NormalRefactorings extends React.Component {
    constructor(props){
        super(props)
        this.state={
            counter:this.props.counter
        }
    }
    counterMore(){
        this.setState({
            counter:this.state.counter +1
        })
    }
    render() { 
        //const {counterMore}=this.props;
        return (  


                this.props.singleElementRefactoring.map(refactoring => {
                this.counterMore.bind(this)
                let text = generateComponent(refactoring.imports, refactoring.mounts, refactoring.functions, refactoring.stringElement);
               
                return (
                    <React.Fragment>
                       
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey={this.props.counter.toString()}>
                                    {refactoring.name}

                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey={this.this.props.counter.toString()}>
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

 
export default NormalRefactorings;