import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Parser, Lexer, ASTWithSource } from './angular';
import { ParseVisitorResolver, ParseVisitorCompiler } from './visitors';

export const PIPES_CONFIG = new InjectionToken('PipesConfig');

export interface PipesConfig {
  pipeName: string;
  pipeInstance: any;
}

@Injectable({providedIn: 'root'})
export class Parse {
  private _parser: Parser = new Parser(new Lexer());
  private _pipesCache: Map<string, any> = new Map<string, any>();
  private _evalCache: Map<string, Function> = new Map<string, Function>();
  private _calcCache: Map<string, Function> = new Map<string, Function>();

  /**
   * Used to dependency inject the Angular 2 parser.
   */

  constructor(@Optional() @Inject(PIPES_CONFIG) pipesConfigs: PipesConfig[][]) {
    if (pipesConfigs && pipesConfigs.length) {
      pipesConfigs
        .filter(pipes => pipes && pipes.length)
        .forEach(pipes => pipes.forEach((pipeData) => this._pipesCache.set(pipeData.pipeName, pipeData.pipeInstance)));
    }
  }

  eval(expression: string): Function {
    if (this._evalCache.has(expression)) {
      return this._evalCache.get(expression);
    }

    const visitor = new ParseVisitorCompiler();

    let ast: ASTWithSource = this._parser.parseInterpolation(expression, 'Parse');

    if (!ast) {
      ast = this._parser.parseBinding(expression, 'Parse');
    }

    const fnBody = ast.visit(visitor);
    const pipesCache = this._pipesCache;
    const getFn = new Function('context', 'pipesCache', `return ${fnBody};`);

    const evalParse = function evalParse(context: any): any {
      return getFn(context, pipesCache);
    };

    this._evalCache.set(expression, evalParse);

    return evalParse;
  }

  calc(expression: string): Function {
    if (this._calcCache.has(expression)) {
      return this._calcCache.get(expression);
    }

    const visitor = new ParseVisitorResolver(this._pipesCache);

    let ast: ASTWithSource = this._parser.parseInterpolation(expression, 'Parse');

    if (!ast) {
      ast = this._parser.parseBinding(expression, 'Parse');
    }

    const calcParse = function calcParse(context: any): any {
      return ast.visit(visitor, context);
    };

    this._calcCache.set(expression, calcParse);

    return calcParse;
  }
}
