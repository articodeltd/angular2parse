import { ModuleWithProviders, NgModule } from '@angular/core';
import { Parse, PIPES_CONFIG, PipesConfig } from './parse';

@NgModule()
export class Angular2ParseModule {
  static forRoot(pipesConfigMap: PipesConfig[]): ModuleWithProviders<any> {
    return {
      ngModule: Angular2ParseModule,
      providers: [{provide: PIPES_CONFIG, multi: true, useValue: pipesConfigMap || []}]
    };
  }
}
