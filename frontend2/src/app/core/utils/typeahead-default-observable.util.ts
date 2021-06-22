
import { Observable } from 'rxjs/internal/Observable';
import { Observer } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';


export const typeaheadDefaultObservable = (model: any,
                                          modelName: string,
                                          service: any,
                                          functionName: string,
                                          options?: any): Observable<any> => {
    return new Observable((observer: Observer<string>) => {
        observer.next(model[modelName]);
    }).pipe(
        debounceTime(500),
        switchMap((query: string) => {
            const excludedKeysFromQuery = ['showAddNewOption','newOptionText'];
            const filteredOptions =  { ...options };
            excludedKeysFromQuery.forEach((key) => {
                delete filteredOptions[key];
            })
            
            const newOpt: any = { 
                ...filteredOptions,
                q: query
            };

            return service[functionName](newOpt).pipe(
                map((resp: any) => {
                    if(resp && resp.data){
                        if(options && options.showAddNewOption){
                            return [{id:'-1', name: options.newOptionText || 'Add new'}, ...resp.data];;
                        }
                        return resp.data
                    }
                    return []
                })
            )
        })
    );
}