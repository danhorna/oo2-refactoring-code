import React from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import { generateComponent, generateArray } from "../js/helpers";
import { CodeBlock, dracula } from "react-code-blocks";
class NotElementRefactoring extends React.Component {
    constructor(props) {
        super(props)
        
    }
  
    render() { 
        return (
                this.props.notElementRefactoring.map(refactoring => {
                let text = generateComponent(refactoring.imports, refactoring.mounts, refactoring.functions, refactoring.stringRefactoring);
                return (
                    <React.Fragment>
                        <Card>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey={this.props.counter.toString()}>
                                    {refactoring.name}
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
 
export default NotElementRefactoring;