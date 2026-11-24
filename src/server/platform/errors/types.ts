export type TuringErrorKind =
    | 'invalid_input'
    | 'malformed_request'
    | 'missing_resource'
    | 'state_conflict'
    | 'unauthenticated'
    | 'unauthorized'
    | 'internal_failure';

export interface TuringErrorOptions extends ErrorOptions {
    kind: TuringErrorKind;
}
