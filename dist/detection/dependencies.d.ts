import { type Platform } from "./platform";
export interface DependencyStatus {
    name: string;
    command: string;
    installed: boolean;
    version?: string;
    installGuide?: string;
}
export interface DependencyCheckResult {
    allInstalled: boolean;
    dependencies: DependencyStatus[];
    platform: Platform;
}
export declare function checkDependency(command: string, versionArg: string): Promise<{
    installed: boolean;
    version?: string;
}>;
export declare function checkAllDependencies(): Promise<DependencyCheckResult>;
//# sourceMappingURL=dependencies.d.ts.map