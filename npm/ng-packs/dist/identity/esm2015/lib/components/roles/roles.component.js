/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { ConfirmationService } from '@abp/ng.theme.shared';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { finalize, pluck } from 'rxjs/operators';
import { CreateRole, DeleteRole, GetRoleById, GetRoles, UpdateRole } from '../../actions/identity.actions';
import { IdentityState } from '../../states/identity.state';
export class RolesComponent {
    /**
     * @param {?} confirmationService
     * @param {?} fb
     * @param {?} store
     */
    constructor(confirmationService, fb, store) {
        this.confirmationService = confirmationService;
        this.fb = fb;
        this.store = store;
        this.visiblePermissions = false;
        this.pageQuery = {
            sorting: 'name',
        };
        this.loading = false;
        this.modalBusy = false;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    onSearch(value) {
        this.pageQuery.filter = value;
        this.get();
    }
    /**
     * @return {?}
     */
    createForm() {
        this.form = this.fb.group({
            name: new FormControl({ value: this.selected.name || '', disabled: this.selected.isStatic }, [
                Validators.required,
                Validators.maxLength(256),
            ]),
            isDefault: [this.selected.isDefault || false],
            isPublic: [this.selected.isPublic || false],
        });
    }
    /**
     * @return {?}
     */
    openModal() {
        this.createForm();
        this.isModalVisible = true;
    }
    /**
     * @return {?}
     */
    onAdd() {
        this.selected = (/** @type {?} */ ({}));
        this.openModal();
    }
    /**
     * @param {?} id
     * @return {?}
     */
    onEdit(id) {
        this.store
            .dispatch(new GetRoleById(id))
            .pipe(pluck('IdentityState', 'selectedRole'))
            .subscribe((/**
         * @param {?} selectedRole
         * @return {?}
         */
        selectedRole => {
            this.selected = selectedRole;
            this.openModal();
        }));
    }
    /**
     * @return {?}
     */
    save() {
        if (!this.form.valid)
            return;
        this.modalBusy = true;
        this.store
            .dispatch(this.selected.id
            ? new UpdateRole(Object.assign({}, this.form.value, { id: this.selected.id }))
            : new CreateRole(this.form.value))
            .subscribe((/**
         * @return {?}
         */
        () => {
            this.modalBusy = false;
            this.isModalVisible = false;
        }));
    }
    /**
     * @param {?} id
     * @param {?} name
     * @return {?}
     */
    delete(id, name) {
        this.confirmationService
            .warn('AbpIdentity::RoleDeletionConfirmationMessage', 'AbpIdentity::AreYouSure', {
            messageLocalizationParams: [name],
        })
            .subscribe((/**
         * @param {?} status
         * @return {?}
         */
        (status) => {
            if (status === "confirm" /* confirm */) {
                this.store.dispatch(new DeleteRole(id));
            }
        }));
    }
    /**
     * @param {?} data
     * @return {?}
     */
    onPageChange(data) {
        this.pageQuery.skipCount = data.first;
        this.pageQuery.maxResultCount = data.rows;
        this.get();
    }
    /**
     * @return {?}
     */
    get() {
        this.loading = true;
        this.store
            .dispatch(new GetRoles(this.pageQuery))
            .pipe(finalize((/**
         * @return {?}
         */
        () => (this.loading = false))))
            .subscribe();
    }
}
RolesComponent.decorators = [
    { type: Component, args: [{
                selector: 'abp-roles',
                template: "<div id=\"identity-roles-wrapper\" class=\"card\">\n  <div class=\"card-header\">\n    <div class=\"row\">\n      <div class=\"col col-md-6\">\n        <h5 class=\"card-title\">{{ 'AbpIdentity::Roles' | abpLocalization }}</h5>\n      </div>\n      <div class=\"text-right col col-md-6\">\n        <button id=\"create-role\" class=\"btn btn-primary\" type=\"button\" (click)=\"onAdd()\">\n          <i class=\"fa fa-plus mr-1\"></i> <span>{{ 'AbpIdentity::NewRole' | abpLocalization }}</span>\n        </button>\n      </div>\n    </div>\n  </div>\n  <div class=\"card-body\">\n    <div id=\"data-tables-table-filter\" class=\"data-tables-filter\">\n      <label\n        ><input\n          type=\"search\"\n          class=\"form-control form-control-sm\"\n          [placeholder]=\"'AbpUi::PagerSearch' | abpLocalization\"\n          (input.debounce)=\"onSearch($event.target.value)\"\n      /></label>\n    </div>\n    <p-table\n      [value]=\"data$ | async\"\n      [lazy]=\"true\"\n      [lazyLoadOnInit]=\"false\"\n      [paginator]=\"true\"\n      [rows]=\"10\"\n      [totalRecords]=\"totalCount$ | async\"\n      [loading]=\"loading\"\n      (onLazyLoad)=\"onPageChange($event)\"\n    >\n      <ng-template pTemplate=\"header\">\n        <tr>\n          <th>{{ 'AbpIdentity::Actions' | abpLocalization }}</th>\n          <th>{{ 'AbpIdentity::RoleName' | abpLocalization }}</th>\n        </tr>\n      </ng-template>\n      <ng-template pTemplate=\"body\" let-data>\n        <tr>\n          <td>\n            <div ngbDropdown class=\"d-inline-block\">\n              <button\n                class=\"btn btn-primary btn-sm dropdown-toggle\"\n                data-toggle=\"dropdown\"\n                aria-haspopup=\"true\"\n                ngbDropdownToggle\n              >\n                <i class=\"fa fa-cog mr-1\"></i>{{ 'AbpIdentity::Actions' | abpLocalization }}\n              </button>\n              <div ngbDropdownMenu>\n                <button ngbDropdownItem (click)=\"onEdit(data.id)\">{{ 'AbpIdentity::Edit' | abpLocalization }}</button>\n                <button ngbDropdownItem (click)=\"providerKey = data.name; visiblePermissions = true\">\n                  {{ 'AbpIdentity::Permissions' | abpLocalization }}\n                </button>\n                <button ngbDropdownItem (click)=\"delete(data.id, data.name)\">\n                  {{ 'AbpIdentity::Delete' | abpLocalization }}\n                </button>\n              </div>\n            </div>\n          </td>\n          <td>{{ data.name }}</td>\n        </tr>\n      </ng-template>\n    </p-table>\n  </div>\n</div>\n\n<abp-modal size=\"md\" [(visible)]=\"isModalVisible\" [busy]=\"modalBusy\">\n  <ng-template #abpHeader>\n    <h3>{{ (selected?.id ? 'AbpIdentity::Edit' : 'AbpIdentity::NewRole') | abpLocalization }}</h3>\n  </ng-template>\n\n  <ng-template #abpBody>\n    <form [formGroup]=\"form\" (ngSubmit)=\"save()\">\n      <div class=\"form-group\">\n        <label for=\"role-name\">{{ 'AbpIdentity::RoleName' | abpLocalization }}</label\n        ><span> * </span>\n        <input autofocus type=\"text\" id=\"role-name\" class=\"form-control\" formControlName=\"name\" />\n      </div>\n\n      <div class=\"custom-checkbox custom-control mb-2\">\n        <input type=\"checkbox\" id=\"role-is-default\" class=\"custom-control-input\" formControlName=\"isDefault\" />\n        <label class=\"custom-control-label\" for=\"role-is-default\">{{\n          'AbpIdentity::DisplayName:IsDefault' | abpLocalization\n        }}</label>\n      </div>\n\n      <div class=\"custom-checkbox custom-control mb-2\">\n        <input type=\"checkbox\" id=\"role-is-public\" class=\"custom-control-input\" formControlName=\"isPublic\" />\n        <label class=\"custom-control-label\" for=\"role-is-public\">{{\n          'AbpIdentity::DisplayName:IsPublic' | abpLocalization\n        }}</label>\n      </div>\n    </form>\n  </ng-template>\n\n  <ng-template #abpFooter>\n    <button type=\"button\" class=\"btn btn-secondary\" #abpClose>\n      {{ 'AbpIdentity::Cancel' | abpLocalization }}\n    </button>\n    <abp-button iconClass=\"fa fa-check\" (click)=\"save()\">{{ 'AbpIdentity::Save' | abpLocalization }}</abp-button>\n  </ng-template>\n</abp-modal>\n\n<abp-permission-management\n  [(visible)]=\"visiblePermissions\"\n  providerName=\"Role\"\n  [providerKey]=\"providerKey\"\n></abp-permission-management>\n"
            }] }
];
/** @nocollapse */
RolesComponent.ctorParameters = () => [
    { type: ConfirmationService },
    { type: FormBuilder },
    { type: Store }
];
RolesComponent.propDecorators = {
    modalContent: [{ type: ViewChild, args: ['modalContent', { static: false },] }]
};
tslib_1.__decorate([
    Select(IdentityState.getRoles),
    tslib_1.__metadata("design:type", Observable)
], RolesComponent.prototype, "data$", void 0);
tslib_1.__decorate([
    Select(IdentityState.getRolesTotalCount),
    tslib_1.__metadata("design:type", Observable)
], RolesComponent.prototype, "totalCount$", void 0);
if (false) {
    /** @type {?} */
    RolesComponent.prototype.data$;
    /** @type {?} */
    RolesComponent.prototype.totalCount$;
    /** @type {?} */
    RolesComponent.prototype.form;
    /** @type {?} */
    RolesComponent.prototype.selected;
    /** @type {?} */
    RolesComponent.prototype.isModalVisible;
    /** @type {?} */
    RolesComponent.prototype.visiblePermissions;
    /** @type {?} */
    RolesComponent.prototype.providerKey;
    /** @type {?} */
    RolesComponent.prototype.pageQuery;
    /** @type {?} */
    RolesComponent.prototype.loading;
    /** @type {?} */
    RolesComponent.prototype.modalBusy;
    /** @type {?} */
    RolesComponent.prototype.modalContent;
    /**
     * @type {?}
     * @private
     */
    RolesComponent.prototype.confirmationService;
    /**
     * @type {?}
     * @private
     */
    RolesComponent.prototype.fb;
    /**
     * @type {?}
     * @private
     */
    RolesComponent.prototype.store;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFicC9uZy5pZGVudGl0eS8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3JvbGVzL3JvbGVzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLE9BQU8sRUFBRSxtQkFBbUIsRUFBVyxNQUFNLHNCQUFzQixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNsRSxPQUFPLEVBQUUsV0FBVyxFQUFhLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNqRixPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUM1QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDakQsT0FBTyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUUzRyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFNNUQsTUFBTSxPQUFPLGNBQWM7Ozs7OztJQTRCekIsWUFBb0IsbUJBQXdDLEVBQVUsRUFBZSxFQUFVLEtBQVk7UUFBdkYsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUFVLE9BQUUsR0FBRixFQUFFLENBQWE7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFPO1FBZjNHLHVCQUFrQixHQUFZLEtBQUssQ0FBQztRQUlwQyxjQUFTLEdBQXdCO1lBQy9CLE9BQU8sRUFBRSxNQUFNO1NBQ2hCLENBQUM7UUFFRixZQUFPLEdBQVksS0FBSyxDQUFDO1FBRXpCLGNBQVMsR0FBWSxLQUFLLENBQUM7SUFLbUYsQ0FBQzs7Ozs7SUFFL0csUUFB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ZSc7XG5pbXBvcnQgeyBDb25maXJtYXRpb25TZXJ2aWNlLCBUb2FzdGVyIH0gZnJvbSAnQGFicC9uZy50aGVtZS5zaGFyZWQnO1xuaW1wb3J0IHsgQ29tcG9uZW50LCBUZW1wbGF0ZVJlZiwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3JtQnVpbGRlciwgRm9ybUdyb3VwLCBWYWxpZGF0b3JzLCBGb3JtQ29udHJvbCB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IFNlbGVjdCwgU3RvcmUgfSBmcm9tICdAbmd4cy9zdG9yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaW5hbGl6ZSwgcGx1Y2sgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBDcmVhdGVSb2xlLCBEZWxldGVSb2xlLCBHZXRSb2xlQnlJZCwgR2V0Um9sZXMsIFVwZGF0ZVJvbGUgfSBmcm9tICcuLi8uLi9hY3Rpb25zL2lkZW50aXR5LmFjdGlvbnMnO1xuaW1wb3J0IHsgSWRlbnRpdHkgfSBmcm9tICcuLi8uLi9tb2RlbHMvaWRlbnRpdHknO1xuaW1wb3J0IHsgSWRlbnRpdHlTdGF0ZSB9IGZyb20gJy4uLy4uL3N0YXRlcy9pZGVudGl0eS5zdGF0ZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FicC1yb2xlcycsXG4gIHRlbXBsYXRlVXJsOiAnLi9yb2xlcy5jb21wb25lbnQuaHRtbCcsXG59KVxuZXhwb3J0IGNsYXNzIFJvbGVzQ29tcG9uZW50IHtcbiAgQFNlbGVjdChJZGVudGl0eVN0YXRlLmdldFJvbGVzKVxuICBkYXRhJDogT2JzZXJ2YWJsZTxJZGVudGl0eS5Sb2xlSXRlbVtdPjtcblxuICBAU2VsZWN0KElkZW50aXR5U3RhdGUuZ2V0Um9sZXNUb3RhbENvdW50KVxuICB0b3RhbENvdW50JDogT2JzZXJ2YWJsZTxudW1iZXI+O1xuXG4gIGZvcm06IEZvcm1Hcm91cDtcblxuICBzZWxlY3RlZDogSWRlbnRpdHkuUm9sZUl0ZW07XG5cbiAgaXNNb2RhbFZpc2libGU6IGJvb2xlYW47XG5cbiAgdmlzaWJsZVBlcm1pc3Npb25zOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJvdmlkZXJLZXk6IHN0cmluZztcblxuICBwYWdlUXVlcnk6IEFCUC5QYWdlUXVlcnlQYXJhbXMgPSB7XG4gICAgc29ydGluZzogJ25hbWUnLFxuICB9O1xuXG4gIGxvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBtb2RhbEJ1c3k6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBAVmlld0NoaWxkKCdtb2RhbENvbnRlbnQnLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgbW9kYWxDb250ZW50OiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlybWF0aW9uU2VydmljZTogQ29uZmlybWF0aW9uU2VydmljZSwgcHJpdmF0ZSBmYjogRm9ybUJ1aWxkZXIsIHByaXZhdGUgc3RvcmU6IFN0b3JlKSB7fVxuXG4gIG9uU2VhcmNoKHZhbHVlKSB7XG4gICAgdGhpcy5wYWdlUXVlcnkuZmlsdGVyID0gdmFsdWU7XG4gICAgdGhpcy5nZXQoKTtcbiAgfVxuXG4gIGNyZWF0ZUZvcm0oKSB7XG4gICAgdGhpcy5mb3JtID0gdGhpcy5mYi5ncm91cCh7XG4gICAgICBuYW1lOiBuZXcgRm9ybUNvbnRyb2woeyB2YWx1ZTogdGhpcy5zZWxlY3RlZC5uYW1lIHx8ICcnLCBkaXNhYmxlZDogdGhpcy5zZWxlY3RlZC5pc1N0YXRpYyB9LCBbXG4gICAgICAgIFZhbGlkYXRvcnMucmVxdWlyZWQsXG4gICAgICAgIFZhbGlkYXRvcnMubWF4TGVuZ3RoKDI1NiksXG4gICAgICBdKSxcbiAgICAgIGlzRGVmYXVsdDogW3RoaXMuc2VsZWN0ZWQuaXNEZWZhdWx0IHx8IGZhbHNlXSxcbiAgICAgIGlzUHVibGljOiBbdGhpcy5zZWxlY3RlZC5pc1B1YmxpYyB8fCBmYWxzZV0sXG4gICAgfSk7XG4gIH1cblxuICBvcGVuTW9kYWwoKSB7XG4gICAgdGhpcy5jcmVhdGVGb3JtKCk7XG4gICAgdGhpcy5pc01vZGFsVmlzaWJsZSA9IHRydWU7XG4gIH1cblxuICBvbkFkZCgpIHtcbiAgICB0aGlzLnNlbGVjdGVkID0ge30gYXMgSWRlbnRpdHkuUm9sZUl0ZW07XG4gICAgdGhpcy5vcGVuTW9kYWwoKTtcbiAgfVxuXG4gIG9uRWRpdChpZDogc3RyaW5nKSB7XG4gICAgdGhpcy5zdG9yZVxuICAgICAgLmRpc3BhdGNoKG5ldyBHZXRSb2xlQnlJZChpZCkpXG4gICAgICAucGlwZShwbHVjaygnSWRlbnRpdHlTdGF0ZScsICdzZWxlY3RlZFJvbGUnKSlcbiAgICAgIC5zdWJzY3JpYmUoc2VsZWN0ZWRSb2xlID0+IHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHNlbGVjdGVkUm9sZTtcbiAgICAgICAgdGhpcy5vcGVuTW9kYWwoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgc2F2ZSgpIHtcbiAgICBpZiAoIXRoaXMuZm9ybS52YWxpZCkgcmV0dXJuO1xuICAgIHRoaXMubW9kYWxCdXN5ID0gdHJ1ZTtcblxuICAgIHRoaXMuc3RvcmVcbiAgICAgIC5kaXNwYXRjaChcbiAgICAgICAgdGhpcy5zZWxlY3RlZC5pZFxuICAgICAgICAgID8gbmV3IFVwZGF0ZVJvbGUoeyAuLi50aGlzLmZvcm0udmFsdWUsIGlkOiB0aGlzLnNlbGVjdGVkLmlkIH0pXG4gICAgICAgICAgOiBuZXcgQ3JlYXRlUm9sZSh0aGlzLmZvcm0udmFsdWUpLFxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMubW9kYWxCdXN5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaXNNb2RhbFZpc2libGUgPSBmYWxzZTtcbiAgICAgIH0pO1xuICB9XG5cbiAgZGVsZXRlKGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuY29uZmlybWF0aW9uU2VydmljZVxuICAgICAgLndhcm4oJ0FicElkZW50aXR5OjpSb2xlRGVsZXRpb25Db25maXJtYXRpb25NZXNzYWdlJywgJ0FicElkZW50aXR5OjpBcmVZb3VTdXJlJywge1xuICAgICAgICBtZXNzYWdlTG9jYWxpemF0aW9uUGFyYW1zOiBbbmFtZV0sXG4gICAgICB9KVxuICAgICAgLnN1YnNjcmliZSgoc3RhdHVzOiBUb2FzdGVyLlN0YXR1cykgPT4ge1xuICAgICAgICBpZiAoc3RhdHVzID09PSBUb2FzdGVyLlN0YXR1cy5jb25maXJtKSB7XG4gICAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaChuZXcgRGVsZXRlUm9sZShpZCkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIG9uUGFnZUNoYW5nZShkYXRhKSB7XG4gICAgdGhpcy5wYWdlUXVlcnkuc2tpcENvdW50ID0gZGF0YS5maXJzdDtcbiAgICB0aGlzLnBhZ2VRdWVyeS5tYXhSZXN1bHRDb3VudCA9IGRhdGEucm93cztcblxuICAgIHRoaXMuZ2V0KCk7XG4gIH1cblxuICBnZXQoKSB7XG4gICAgdGhpcy5sb2FkaW5nID0gdHJ1ZTtcbiAgICB0aGlzLnN0b3JlXG4gICAgICAuZGlzcGF0Y2gobmV3IEdldFJvbGVzKHRoaXMucGFnZVF1ZXJ5KSlcbiAgICAgIC5waXBlKGZpbmFsaXplKCgpID0+ICh0aGlzLmxvYWRpbmcgPSBmYWxzZSkpKVxuICAgICAgLnN1YnNjcmliZSgpO1xuICB9XG59XG4iXX0=