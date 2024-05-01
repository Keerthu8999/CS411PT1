import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DataInsights from './DataInsights';
import DataInteractive from './DataInteractive';
import CategoryChartWrapper from './CategoryChartWrapper';


function DataViz() {

    return (
        <Tabs defaultActiveKey="insight">
            <Tab eventKey="insight" title="Insights">
                <DataInsights />
            </Tab>
            <Tab eventKey="paperchart" title="Visualization">
                <CategoryChartWrapper />
            </Tab>
            <Tab eventKey="interactivecount" title="Interactive">
                <DataInteractive />
            </Tab>
        </Tabs>
    );

};

export default DataViz;