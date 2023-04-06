import React from 'react';
import { Grid } from '@material-ui/core';
import NeoCodeEditorComponent from '../component/editor/CodeEditorComponent';
import NeoReport from '../report/Report';
import { SideNavigationItem } from '@neo4j-ndl/react';
import { ChartBarIconSolid } from '@neo4j-ndl/react/icons';
import { Dialog, Typography } from '@neo4j-ndl/react';

export const NeoReportExamplesModal = ({ database, examples, extensions, navItemClass }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <SideNavigationItem onClick={handleClickOpen} icon={<ChartBarIconSolid className={navItemClass} />}>
        Examples
      </SideNavigationItem>

      {open ? (
        <Dialog
          size='large'
          open={open == true}
          onClose={handleClose}
          aria-labelledby='form-dialog-title'
          style={{ maxWidth: '90%' }}
        >
          <Dialog.Header id='form-dialog-title'>
            <ChartBarIconSolid className='icon-base icon-inline text-r' />
            Report Examples
          </Dialog.Header>
          <div>
            <Dialog.Content>
              <hr></hr>
              {examples.map((example) => {
                return (
                  <>
                    <Typography variant='h3'>{example.title}</Typography>
                    {example.description}
                    <br />
                    <br />
                    <Grid container spacing={4}>
                      <Grid item xs={4}>
                        <div style={{ width: '400px', border: '0px solid lightgrey' }}>
                          <NeoCodeEditorComponent
                            editable={false}
                            placeholder=''
                            value={example.exampleQuery}
                            language={example.type == 'iframe' ? 'url' : 'cypher'}
                          ></NeoCodeEditorComponent>
                        </div>
                      </Grid>

                      <Grid item xs={8}>
                        <div
                          style={{
                            height: '355px',
                            width: '800px',
                            overflow: 'hidden',
                            border: '1px solid lightgrey',
                          }}
                        >
                          <NeoReport
                            query={example.syntheticQuery}
                            database={database}
                            disabled={!open}
                            extensions={extensions}
                            selection={example.selection}
                            parameters={example.globalParameters}
                            settings={example.settings}
                            fields={example.fields}
                            dimensions={example.dimensions}
                            ChartType={example.chartType}
                            type={example.type}
                          />
                        </div>
                      </Grid>
                    </Grid>
                    <hr></hr>
                  </>
                );
              })}
            </Dialog.Content>
          </div>
        </Dialog>
      ) : (
        <></>
      )}
    </div>
  );
};

export default NeoReportExamplesModal;
