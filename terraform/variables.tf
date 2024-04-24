variable "token" {
  description = "Your Linode API Personal Access Token. (required)"
  default = "89ca55823b21567a043930328cf5d9778e0fc42f01066decc8d6dcace70e5e73"
}

variable "k8s_version" {
  description = "The Kubernetes version to use for this cluster. (required)"
  default = "1.28"
}

variable "label" {
  description = "The unique label to assign to this cluster. (required)"
  default = "cloud"
}

variable "region" {
  description = "The region where your cluster will be located. (required)"
  default = "eu-central"
}

variable "tags" {
  description = "Tags to apply to your cluster for organizational purposes. (optional)"
  type = list(string)
  default = ["test"]
}

variable "pools" {
  description = "The Node Pool specifications for the Kubernetes cluster. (required)"
  type = list(object({
    type = string
    count = number
  }))
  default = [
    {
      type = "g6-standard-4"
      count = 3
    },
    {
      type = "g6-standard-8"
      count = 3
    }
  ]
}
