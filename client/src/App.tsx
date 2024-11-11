import React, { Component } from "react";
import { solid, split, Square } from './square';
// import { SquareElem } from './square_draw';
import { FileEditor } from "./FileEditor";
import { FilePicker } from "./FilePicker";
import { listFiles, loadFile, saveFile } from './server';


/** Describes set of possible app page views */
type Page = { kind: "picker", loading: boolean } | { kind: "editor", name: string, loading: boolean }; // TODO: modify to set of relevant page states
         

type AppState = {
  show: Page;   // Stores state for the current page of the app to show
  designNames: string[];
  currentDesign: Square | undefined;
};

/**
 * Displays the square application containing either a list of files names
 * to pick from or an editor for files files
 */
export class App extends Component<{}, AppState> {

  constructor(props: {}) {
    super(props);

    this.state = {show: 
      { kind: "picker", loading: true },
      designNames: [],
      currentDesign: undefined}; // TODO: initialize starting view
  }
  
  doMountClick = (): void => {
    this.doDesignNamesResponse();
  }

  doDesignNamesResponse = (): void => listFiles((names: string[]) => this.setState({ designNames: names, show: { kind: "picker", loading: false } }));

  // render = (): JSX.Element => {
  //   const sq: Square = split(solid("blue"), solid("orange"), solid("purple"), solid("red"));

  //   // TODO (Q2): Replace return with commented out line to render full editor
  //   //            component instead of always a static square
  //   return <SquareElem width={600n} height={600n} square={sq}
  //             onClick={this.doSquareClick}/>;
  //   // return <FileEditor initialState={sq}>

  //   // TODO (Q4): render the correct component or loading message depending on 
  //   // current view instead of always displaying editor
  // };

  render = (): JSX.Element => {
    const show = this.state.show;
    const designNames = this.state.designNames;

    if (show.loading) {
      return <div>Loading...</div>;
    }

    if (show.kind === "picker") {
      return <FilePicker onCreate={this.doHandleCreateClick} designNames={designNames} onOpen={this.doHandleOpenClick} />;
    } else if (show.kind === "editor") {
      return this.state.currentDesign ? (
        <FileEditor initialState={this.state.currentDesign} designName={show.name} onSave={this.doHandleSaveClick} onBack={this.doHandleBackClick} />
      ) : (
        <div>Loading...</div>
      );
    }

    return <div>Loading...</div>;
  };
  
  // doSquareClick = (path: Path): void => {
  //   console.log(path);
  //   alert("Stop that!");
  // };

  // TODO: write functions here to handle switching between app pages and
  //       for accessing server through server.ts helper functions

  doHandleCreateClick = (name: string): void => {
    const initialSquare: Square = split(solid("blue"), solid("orange"), solid("purple"), solid("red"));
    this.setState({ show: { kind: "editor", name, loading: false }, currentDesign: initialSquare });
  };

  doHandleSaveClick = (name: string, root: Square): void => {
    this.setState({ show: { kind: "editor", name, loading: true } });
    saveFile(name, root, (_savedName, saved) => saved && this.doDesignNamesResponse());
  };

  doHandleBackClick = (): void => {
    this.setState({ show: { kind: "picker", loading: true }, currentDesign: undefined });
    this.doDesignNamesResponse();
  };

  doHandleOpenClick = (name: string): void => {
    this.setState({ show: { kind: "editor", name, loading: true } });
  
    loadFile(name, (loadedName, sq) => {
      if (sq) {
        this.setState({ currentDesign: sq, 
          show: { kind: "editor", name: loadedName, loading: false }
        });
      } else {
        this.setState({ show: { kind: "picker", loading: false } });
      }
    });
  };
}
