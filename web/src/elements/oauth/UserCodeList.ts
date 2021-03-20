import { gettext } from "django";
import { customElement, html, property, TemplateResult } from "lit-element";
import { AKResponse } from "../../api/Client";
import { Table, TableColumn } from "../table/Table";

import "../forms/DeleteForm";
import { PAGE_SIZE } from "../../constants";
import { ExpiringBaseGrantModel, Oauth2Api } from "authentik-api";
import { DEFAULT_CONFIG } from "../../api/Config";

@customElement("ak-user-oauth-code-list")
export class UserOAuthCodeList extends Table<ExpiringBaseGrantModel> {
    @property()
    userId?: string;

    apiEndpoint(page: number): Promise<AKResponse<ExpiringBaseGrantModel>> {
        return new Oauth2Api(DEFAULT_CONFIG).oauth2AuthorizationCodesList({
            user: this.userId,
            ordering: "expires",
            page: page,
            pageSize: PAGE_SIZE,
        });
    }

    order = "-expires";

    columns(): TableColumn[] {
        return [
            new TableColumn("Provider", "provider"),
            new TableColumn("Expires", "expires"),
            new TableColumn("Scopes", "scope"),
            new TableColumn(""),
        ];
    }

    row(item: ExpiringBaseGrantModel): TemplateResult[] {
        return [
            html`${item.provider.name}`,
            html`${item.expires?.toLocaleString()}`,
            html`${item.scope.join(", ")}`,
            html`
            <ak-forms-delete
                .obj=${item}
                objectLabel=${gettext("Authorization Code")}
                .delete=${() => {
                    return new Oauth2Api(DEFAULT_CONFIG).oauth2AuthorizationCodesDelete({
                        id: item.pk || 0,
                    });
                }}>
                <button slot="trigger" class="pf-c-button pf-m-danger">
                    ${gettext("Delete Authorization Code")}
                </button>
            </ak-forms-delete>`,
        ];
    }

}
