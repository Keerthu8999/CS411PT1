import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DataInsights from './DataInsights';
import DataInteractive from './DataInteractive';


function DataViz() {

    return (
        <Tabs defaultActiveKey="insight">
            <Tab eventKey="inisght" title="Insights">
                <DataInsights />
            </Tab>
            <Tab eventKey="interactivecount" title="Interactive">
                <DataInteractive />
            </Tab>
        </Tabs>
    );

};

export default DataViz;