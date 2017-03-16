import {Injectable, Compiler} from "@angular/core";
import {Parser, Lexer} from "../angular/compiler";
import {ASTWithSource} from "../angular/compiler";
import {ParseVisitorResolver} from "../visitors";

@Injectable()
export class Parse {
    private _parser: Parser = new Parser(new Lexer());
    private _pipesCache: Map<string, any> = new Map<string, any>();
    private _evalCache: Map<string, ASTWithSource> = new Map<string, ASTWithSource>();

    /**
     * Used to dependency inject the Angular 2 parser.
     */
    constructor(private _compiler: Compiler) {
        const compiler: any = this._compiler;
        const pipeCache = compiler._delegate._metadataResolver._pipeCache;

        pipeCache.forEach((pipeMetadata, pipe) => this._pipesCache.set(pipeMetadata.name, new pipe()));
    }


    eval(expression: string): Function {
        let ast: ASTWithSource = null;
        const visitor = new ParseVisitorResolver(this._pipesCache);

        if (this._evalCache.has(expression)) {
            ast = this._evalCache.get(expression);
        }
        else {
            ast = this._parser.parseInterpolation(expression, 'Parse');

            if (!ast) {
                ast = this._parser.parseBinding(expression, 'Parse');
            }

            this._evalCache.set(expression, ast);
        }

        return function calcParse(context: Object): any {
            return ast.visit(visitor, context);
        };
    }
}